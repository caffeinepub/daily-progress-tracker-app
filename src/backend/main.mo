import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type TaskStatus = {
    #done;
    #pending;
  };

  public type GoalType = {
    #study;
    #fitness;
    #coding;
    #other;
  };

  public type Task = {
    id : Nat;
    title : Text;
    date : Text;
    status : TaskStatus;
    category : ?Text;
    notes : ?Text;
  };

  public type UserProfile = {
    displayName : Text;
    goalType : GoalType;
  };

  public type TaskEntry = {
    task : Task;
    isCompleted : Bool;
  };

  module TaskEntry {
    public func compare(entry1 : TaskEntry, entry2 : TaskEntry) : Order.Order {
      Nat.compare(entry1.task.id, entry2.task.id);
    };
  };

  var nextTaskId = 0;
  var currentStreak = 0;
  var bestStreak = 0;

  let userProfiles = Map.empty<Principal, UserProfile>();

  let tasks = Map.empty<Principal, List.List<TaskEntry>>();

  public shared ({ caller }) func createTask(
    title : Text,
    date : Text,
    category : ?Text,
    notes : ?Text
  ) : async () {
    verifyUser(caller);

    let taskId = nextTaskId;
    nextTaskId += 1;

    let newTask : Task = {
      id = taskId;
      title;
      date;
      status = #pending;
      category;
      notes;
    };

    let taskEntry : TaskEntry = {
      task = newTask;
      isCompleted = false;
    };

    let existingTasks = switch (tasks.get(caller)) {
      case (null) { List.empty<TaskEntry>() };
      case (?taskList) { taskList };
    };

    existingTasks.add(taskEntry);
    tasks.add(caller, existingTasks);
  };

  public query ({ caller }) func getTasksByDate(date : Text) : async [Task] {
    verifyUser(caller);

    let taskList = switch (tasks.get(caller)) {
      case (null) { List.empty<TaskEntry>() };
      case (?entries) { entries };
    };

    let filteredTasks = taskList.filter(
      func(taskEntry) {
        taskEntry.task.date == date;
      }
    );

    // The type parameter <TaskEntry, Task> is necessary here
    filteredTasks.map<TaskEntry, Task>(
      func(entry) {
        entry.task;
      }
    ).toArray();
  };

  public shared ({ caller }) func editTask(
    taskId : Nat,
    newTitle : Text,
    newDate : Text,
    newStatus : TaskStatus,
    newCategory : ?Text,
    newNotes : ?Text
  ) : async () {
    verifyUser(caller);

    let updatedTasks = switch (tasks.get(caller)) {
      case (null) { List.empty<TaskEntry>() };
      case (?taskList) {
        taskList.map<TaskEntry, TaskEntry>(
          func(entry) {
            if (entry.task.id == taskId) {
              let updatedTask : Task = {
                id = taskId;
                title = newTitle;
                date = newDate;
                status = newStatus;
                category = newCategory;
                notes = newNotes;
              };
              {
                task = updatedTask;
                isCompleted = (newStatus == #done);
              };
            } else {
              entry;
            };
          }
        );
      };
    };
    tasks.add(caller, updatedTasks);
  };

  public shared ({ caller }) func deleteTask(taskId : Nat) : async () {
    verifyUser(caller);

    let updatedTasks = switch (tasks.get(caller)) {
      case (null) { List.empty<TaskEntry>() };
      case (?taskList) {
        taskList.filter(
          func(entry) {
            entry.task.id != taskId;
          }
        );
      };
    };
    tasks.add(caller, updatedTasks);
  };

  public query ({ caller }) func getStreakStatus() : async (Nat, Nat) {
    verifyUser(caller);
    (currentStreak, bestStreak);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    verifyUser(caller);
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  func verifyUser(caller : Principal) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
  };
};
