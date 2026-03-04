import List "mo:core/List";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Nat64 "mo:core/Nat64";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  type FeedEntry = {
    id : Nat;
    title : Text;
    summary : Text;
    domain : Text;
    isPublic : Bool;
    isFeatured : Bool;
    timestamp : Int;
  };

  module FeedEntry {
    func compareByTimestamp(entry1 : FeedEntry, entry2 : FeedEntry) : Order.Order {
      Nat64.compare(
        Nat64.fromIntWrap(entry1.timestamp),
        Nat64.fromIntWrap(entry2.timestamp),
      );
    };
  };

  type Pillar = {
    id : Nat;
    name : Text;
    mandate : Text;
    strategicRole : Text;
    operationalModel : Text;
    initiatives : Text;
    futureDirection : Text;
    governanceNote : Text;
  };

  type PathwayInterest = {
    pathway : Text;
    timestamp : Int;
  };

  type CollaborationRequest = {
    id : Nat;
    name : Text;
    email : Text;
    pathway : Text;
    message : Text;
    timestamp : Int;
  };

  var nextFeedId = 1;
  var nextCollabReqId = 1;

  let feeds = List.empty<FeedEntry>();
  let pathwayInterests = List.empty<PathwayInterest>();
  let collaborationRequests = List.empty<CollaborationRequest>();

  let pillars = [
    {
      id = 1;
      name = "EPOCHS (Research & Development)";
      mandate = "Drive cutting-edge research and innovation";
      strategicRole = "Research Leadership";
      operationalModel = "Interdisciplinary teams";
      initiatives = "Collaborative research projects";
      futureDirection = "Global partnerships and expansion";
      governanceNote = "Research Advisory Board oversees direction";
    },
    {
      id = 2;
      name = "HUMANON (Talent & Field Incubation)";
      mandate = "Develop and nurture talent pipelines";
      strategicRole = "Talent Incubation";
      operationalModel = "Mentorship and training programs";
      initiatives = "Scholarships and incubators";
      futureDirection = "Expansion of talent networks";
      governanceNote = "Talent Incubation Board manages programs";
    },
    {
      id = 3;
      name = "STEAMI (Intelligence & Knowledge Platform)";
      mandate = "Provide a central hub for knowledge sharing";
      strategicRole = "Intelligence Platform";
      operationalModel = "Digital knowledge management systems";
      initiatives = "Knowledge repositories and analytics";
      futureDirection = "Global knowledge sharing expansion";
      governanceNote = "Knowledge Platform Board oversees integrity";
    },
    {
      id = 4;
      name = "NOVA (Media Translation)";
      mandate = "Translate complex research for public understanding";
      strategicRole = "Media Outreach";
      operationalModel = "Media production and public campaigns";
      initiatives = "Podcast series and educational videos";
      futureDirection = "Expansion into interactive media formats";
      governanceNote = "Media Translation Board ensures accuracy";
    },
    {
      id = 5;
      name = "TERRA (Climate & Natural Life Research)";
      mandate = "Focus on climate and biodiversity research";
      strategicRole = "Sustainability Leadership";
      operationalModel = "Collaborative research and community projects";
      initiatives = "Sustainability projects and policy advocacy";
      futureDirection = "Global climate initiatives expansion";
      governanceNote = "Climate Research Board manages initiatives";
    },
    {
      id = 6;
      name = "EQUIS (Equity & Sustainable Funding)";
      mandate = "Ensure equitable and sustainable funding";
      strategicRole = "Financial Sustainability";
      operationalModel = "Grants management and philanthropy";
      initiatives = "Sustainable development and funding programs";
      futureDirection = "Global funding partnerships";
      governanceNote = "Funding Board oversees transparency";
    },
    {
      id = 7;
      name = "ETHOS (Ethical Oversight)";
      mandate = "Maintain ethical standards and practices";
      strategicRole = "Ethical Oversight";
      operationalModel = "Ethics review and assessment";
      initiatives = "Ethical dilemma analyses and training programs";
      futureDirection = "Expansion of ethical frameworks";
      governanceNote = "Ethics Board ensures compliance";
    },
  ];

  feeds.addAll(
    [
      {
        id = 1;
        title = "Climate Change Impact Analysis";
        summary = "Comprehensive study on global climate effects";
        domain = "Climate";
        isPublic = true;
        isFeatured = true;
        timestamp = Time.now();
      },
      {
        id = 2;
        title = "AI in Healthcare";
        summary = "Exploring AI's role in healthcare improvement";
        domain = "AI";
        isPublic = true;
        isFeatured = false;
        timestamp = Time.now();
      },
      {
        id = 3;
        title = "Educational Reform";
        summary = "Innovative approaches to global education";
        domain = "Education";
        isPublic = true;
        isFeatured = true;
        timestamp = Time.now();
      },
      {
        id = 4;
        title = "Ethical AI Development";
        summary = "Ensuring ethical standards in AI technologies";
        domain = "Ethics";
        isPublic = true;
        isFeatured = false;
        timestamp = Time.now();
      },
      {
        id = 5;
        title = "Public Health Innovations";
        summary = "Advances in global health and well-being";
        domain = "Health";
        isPublic = true;
        isFeatured = false;
        timestamp = Time.now();
      },
      {
        id = 6;
        title = "Research Collaboration";
        summary = "Interdisciplinary research initiatives";
        domain = "Research";
        isPublic = true;
        isFeatured = true;
        timestamp = Time.now();
      },
    ].values(),
  );

  nextFeedId := 7;

  public query func getPublicFeeds() : async [FeedEntry] {
    feeds.values().toArray().filter(
      func(feed) { feed.isPublic }
    );
  };

  public query func getFeaturedFeeds() : async [FeedEntry] {
    feeds.values().toArray().filter(
      func(feed) { feed.isPublic and feed.isFeatured }
    );
  };

  public shared ({ caller }) func createFeed(title : Text, summary : Text, domain : Text, isPublic : Bool, isFeatured : Bool) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create feeds");
    };

    let newEntry : FeedEntry = {
      id = nextFeedId;
      title;
      summary;
      domain;
      isPublic;
      isFeatured;
      timestamp = Time.now();
    };
    feeds.add(newEntry);
    nextFeedId += 1;
  };

  public shared ({ caller }) func updateFeed(id : Nat, title : Text, summary : Text, domain : Text, isPublic : Bool, isFeatured : Bool) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update feeds");
    };

    let updatedFeeds = feeds.map<FeedEntry, FeedEntry>(
      func(feed) {
        if (feed.id == id) {
          {
            id;
            title;
            summary;
            domain;
            isPublic;
            isFeatured;
            timestamp = Time.now();
          };
        } else { feed };
      }
    );

    feeds.clear();
    feeds.addAll(updatedFeeds.values());
  };

  public shared ({ caller }) func deleteFeed(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete feeds");
    };

    let filteredFeeds = feeds.filter(
      func(feed) { feed.id != id }
    );

    feeds.clear();
    feeds.addAll(filteredFeeds.values());
  };

  public shared ({ caller }) func toggleFeatured(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can toggle featured status");
    };

    let updatedFeeds = feeds.map<FeedEntry, FeedEntry>(
      func(feed) {
        if (feed.id == id) {
          { feed with isFeatured = not feed.isFeatured };
        } else { feed };
      }
    );

    feeds.clear();
    feeds.addAll(updatedFeeds.values());
  };

  public query ({ caller }) func getAllPillars() : async [Pillar] {
    pillars;
  };

  public shared ({ caller }) func logPathwayInterest(pathway : Text) : async () {
    pathwayInterests.add({
      pathway;
      timestamp = Time.now();
    });
  };

  public query ({ caller }) func getPathwayStats() : async [(Text, Nat)] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view pathway statistics");
    };

    let pathwayMap = Map.empty<Text, Nat>();
    
    for (interest in pathwayInterests.values()) {
      let currentCount = pathwayMap.get(interest.pathway);
      switch (currentCount) {
        case (?count) {
          pathwayMap.add(interest.pathway, count + 1);
        };
        case null {
          pathwayMap.add(interest.pathway, 1);
        };
      };
    };

    pathwayMap.entries().toArray();
  };

  public shared ({ caller }) func submitCollaborationRequest(name : Text, email : Text, pathway : Text, message : Text) : async () {
    collaborationRequests.add({
      id = nextCollabReqId;
      name;
      email;
      pathway;
      message;
      timestamp = Time.now();
    });
    nextCollabReqId += 1;
  };

  public query ({ caller }) func getCollaborationRequests() : async [CollaborationRequest] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view collaboration requests");
    };

    collaborationRequests.values().toArray();
  };
};
