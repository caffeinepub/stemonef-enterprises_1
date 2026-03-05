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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can log pathway interests");
    };

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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit collaboration requests");
    };

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

  // HUMANON data integration
  // Humans, Projects, Partners, Stats
  public type HumanonMentor = {
    id : Nat;
    name : Text;
    domain : Text;
    organization : Text;
    role : Text;
    profileUrl : Text;
  };

  public type HumanonProject = {
    id : Nat;
    title : Text;
    researchDomain : Text;
    participantTeam : Text;
    summary : Text;
    outcome : Text;
    mentorsInvolved : Text;
    publishedAt : Int;
  };

  public type HumanonPartner = {
    id : Nat;
    name : Text;
    sector : Text;
    description : Text;
  };

  public type HumanonStats = {
    participantsEnrolled : Nat;
    projectsCompleted : Nat;
    industryPartners : Nat;
    careerPlacements : Nat;
    countriesRepresented : Nat;
  };

  var nextProjectId = 5;
  var nextPartnerId = 5;

  let humanonMentors = List.fromArray<HumanonMentor>(
    [
      {
        id = 1;
        name = "Dr. Amara Osei";
        domain = "Climate Systems";
        organization = "EPOCHS Research Lab";
        role = "Senior Research Mentor";
        profileUrl = "";
      },
      {
        id = 2;
        name = "Prof. Lena Richter";
        domain = "Ethical AI";
        organization = "STEAMI Intelligence";
        role = "AI Ethics Advisor";
        profileUrl = "";
      },
      {
        id = 3;
        name = "Dr. Rani Patel";
        domain = "Biomedical Research";
        organization = "Global Health Institute";
        role = "Research Director";
        profileUrl = "";
      },
      {
        id = 4;
        name = "James Okoro";
        domain = "Deep Technology";
        organization = "EIOS Systems";
        role = "Technology Lead";
        profileUrl = "";
      },
      {
        id = 5;
        name = "Dr. Mei-Lin Zhao";
        domain = "Environmental Science";
        organization = "Project GAIA";
        role = "Field Research Coordinator";
        profileUrl = "";
      },
      {
        id = 6;
        name = "Prof. Samuel Torres";
        domain = "Cognitive Systems";
        organization = "STEMESA Lab";
        role = "Cognitive Science Mentor";
        profileUrl = "";
      },
    ]
  );

  let humanonProjects = List.fromArray<HumanonProject>(
    [
      {
        id = 1;
        title = "Urban Heat Mapping Initiative";
        researchDomain = "Climate Systems";
        participantTeam = "Aisha Ndoye, Karan Mehta, Sofia Alves";
        summary = "Mapping urban heat islands across 12 cities";
        outcome = "Dataset adopted by 3 municipal governments";
        mentorsInvolved = "Dr. Amara Osei, Dr. Mei-Lin Zhao";
        publishedAt = Time.now();
      },
      {
        id = 2;
        title = "Bias Detection in Healthcare AI";
        researchDomain = "Ethical AI";
        participantTeam = "Zara Ahmed, Liu Wei, Carlos Hernandez";
        summary = "Framework for bias detection in clinical AI";
        outcome = "Open-source adoption in multiple platforms";
        mentorsInvolved = "Prof. Lena Richter, Dr. Rani Patel";
        publishedAt = Time.now();
      },
      {
        id = 3;
        title = "Coastal Resilience Data Network";
        researchDomain = "Environmental Intelligence";
        participantTeam = "Olumide Bello, Priya Sharma, Thomas Müller";
        summary = "Distributed IoT sensor network for coastal data";
        outcome = "Policy citation and ecosystem adaptation";
        mentorsInvolved = "Dr. Mei-Lin Zhao, James Okoro";
        publishedAt = Time.now();
      },
      {
        id = 4;
        title = "Explainable Neural Decision Systems";
        researchDomain = "Cognitive AI";
        participantTeam = "Fatima Al-Hassan, Erik Lindqvist";
        summary = "Enhanced interpretability tooling for neural networks";
        outcome = "STEAMI adoption for global model deployment";
        mentorsInvolved = "Prof. Samuel Torres, Prof. Lena Richter";
        publishedAt = Time.now();
      },
    ]
  );

  let humanonPartners = List.fromArray<HumanonPartner>(
    [
      {
        id = 1;
        name = "Nexus Climate Solutions";
        sector = "Climate Technology";
        description = "Develops climate solutions for sustainable ecosystems";
      },
      {
        id = 2;
        name = "Meridian Health Systems";
        sector = "Healthcare";
        description = "Focuses on innovative healthcare improvements";
      },
      {
        id = 3;
        name = "Orion Deep Tech";
        sector = "Technology Infrastructure";
        description = "Pushes boundaries in technological advancements";
      },
      {
        id = 4;
        name = "Verdant Policy Group";
        sector = "Policy and Governance";
        description = "Leads in policy and governance innovation";
      },
    ]
  );

  var humanonStats : HumanonStats = {
    participantsEnrolled = 30;
    projectsCompleted = 12;
    industryPartners = 8;
    careerPlacements = 24;
    countriesRepresented = 6;
  };

  // ELPIS functionality
  public type ElpisCouncilMember = {
    id : Nat;
    name : Text;
    domain : Text;
    organization : Text;
    role : Text;
    biography : Text;
    expertise : Text;
  };

  public type ElpisGuidanceArea = {
    id : Nat;
    domain : Text;
    description : Text;
    contribution : Text;
  };

  public type ElpisAnnouncement = {
    id : Nat;
    title : Text;
    summary : Text;
    category : Text;
    isPublic : Bool;
    publishedAt : Int;
  };

  var nextCouncilMemberId = 7;
  var nextGuidanceAreaId = 6;
  var nextAnnouncementId = 3;

  let councilMembers = List.fromArray<ElpisCouncilMember>(
    [
      {
        id = 1;
        name = "Dr. Sofia Alvarez";
        domain = "Ethics";
        organization = "Center for Global Ethics";
        role = "Council Chair";
        biography = "Leading expert in ethical frameworks for emerging technologies";
        expertise = "AI ethics, bioethics";
      },
      {
        id = 2;
        name = "Prof. Lars Petersen";
        domain = "Policy";
        organization = "Institute for Policy Innovation";
        role = "Policy Advisor";
        biography = "International policy strategist focused on digital economies";
        expertise = "Public policy, economic development";
      },
      {
        id = 3;
        name = "Dr. Leila Mansour";
        domain = "Climate";
        organization = "Gaia Research Lab";
        role = "Climate Science Lead";
        biography = "Renowned climate scientist with global impact";
        expertise = "Climate modeling, sustainability";
      },
      {
        id = 4;
        name = "Prof. Kenji Nakamura";
        domain = "AI";
        organization = "InnovateAI Institute";
        role = "AI Technology Advisor";
        biography = "Pioneer in AI development and machine learning";
        expertise = "AI research, machine learning";
      },
      {
        id = 5;
        name = "Dr. Maria Silva";
        domain = "Education";
        organization = "EdTech Global";
        role = "Education Expert";
        biography = "Champion for accessible education worldwide";
        expertise = "Digital learning, education reform";
      },
      {
        id = 6;
        name = "Dr. Michael Brandt";
        domain = "Strategic Foresight";
        organization = "Futures Institute";
        role = "Strategic Foresight Lead";
        biography = "Expert in strategic foresight and future planning";
        expertise = "Scenario planning, innovation strategy";
      },
    ]
  );

  let guidanceAreas = List.fromArray<ElpisGuidanceArea>(
    [
      {
        id = 1;
        domain = "AI Ethics";
        description = "Focuses on developing ethical AI frameworks";
        contribution = "Created global AI ethics standards";
      },
      {
        id = 2;
        domain = "Climate Policy";
        description = "Guides policy development for climate action";
        contribution = "Published influential climate policy papers";
      },
      {
        id = 3;
        domain = "Science Education";
        description = "Supports advancements in science education";
        contribution = "Innovative STEM curriculum resources";
      },
      {
        id = 4;
        domain = "Technology Governance";
        description = "Promotes responsible tech governance practices";
        contribution = "Developed blockchain governance frameworks";
      },
      {
        id = 5;
        domain = "Global Research Collaboration";
        description = "Facilitates international research partnerships";
        contribution = "Establishing global collaborative research efforts";
      },
    ]
  );

  let announcements = List.fromArray<ElpisAnnouncement>(
    [
      {
        id = 1;
        title = "Ethics Charter Published";
        summary = "Council releases comprehensive global ethics framework";
        category = "Ethics";
        isPublic = true;
        publishedAt = Time.now();
      },
      {
        id = 2;
        title = "AI Governance Framework Approved";
        summary = "New standards for AI governance adopted by council";
        category = "AI";
        isPublic = true;
        publishedAt = Time.now();
      },
    ]
  );

  // Query APIs
  public query ({ caller }) func getHumanonMentors() : async [HumanonMentor] {
    humanonMentors.toArray();
  };

  public query ({ caller }) func getHumanonProjects() : async [HumanonProject] {
    humanonProjects.toArray();
  };

  public query ({ caller }) func getHumanonPartners() : async [HumanonPartner] {
    humanonPartners.toArray();
  };

  public query ({ caller }) func getHumanonStats() : async HumanonStats {
    humanonStats;
  };

  // Admin functions
  public shared ({ caller }) func createHumanonMentor(
    name : Text,
    domain : Text,
    organization : Text,
    role : Text,
    profileUrl : Text,
  ) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create mentors");
    };

    let newMentor = {
      id = humanonMentors.size() + 1;
      name;
      domain;
      organization;
      role;
      profileUrl;
    };

    humanonMentors.add(newMentor);
  };

  public shared ({ caller }) func deleteHumanonMentor(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete mentors");
    };

    let filteredMentors = humanonMentors.filter(
      func(mentor) { mentor.id != id }
    );

    humanonMentors.clear();
    humanonMentors.addAll(filteredMentors.values());
  };

  public shared ({ caller }) func createHumanonProject(
    title : Text,
    researchDomain : Text,
    participantTeam : Text,
    summary : Text,
    outcome : Text,
    mentorsInvolved : Text,
  ) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create projects");
    };

    let newProject = {
      id = nextProjectId;
      title;
      researchDomain;
      participantTeam;
      summary;
      outcome;
      mentorsInvolved;
      publishedAt = Time.now();
    };

    humanonProjects.add(newProject);
    nextProjectId += 1;
  };

  public shared ({ caller }) func updateHumanonProject(
    id : Nat,
    title : Text,
    researchDomain : Text,
    participantTeam : Text,
    summary : Text,
    outcome : Text,
    mentorsInvolved : Text,
  ) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update projects");
    };

    let updatedProjects = humanonProjects.map<HumanonProject, HumanonProject>(
      func(project) {
        if (project.id == id) {
          {
            id;
            title;
            researchDomain;
            participantTeam;
            summary;
            outcome;
            mentorsInvolved;
            publishedAt = Time.now();
          };
        } else { project };
      }
    );

    humanonProjects.clear();
    humanonProjects.addAll(updatedProjects.values());
  };

  public shared ({ caller }) func deleteHumanonProject(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete projects");
    };

    let filteredProjects = humanonProjects.filter(
      func(project) { project.id != id }
    );

    humanonProjects.clear();
    humanonProjects.addAll(filteredProjects.values());
  };

  public shared ({ caller }) func createHumanonPartner(
    name : Text,
    sector : Text,
    description : Text,
  ) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create partners");
    };

    let newPartner = {
      id = nextPartnerId;
      name;
      sector;
      description;
    };

    humanonPartners.add(newPartner);
    nextPartnerId += 1;
  };

  public shared ({ caller }) func deleteHumanonPartner(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete partners");
    };

    let filteredPartners = humanonPartners.filter(
      func(partner) { partner.id != id }
    );

    humanonPartners.clear();
    humanonPartners.addAll(filteredPartners.values());
  };

  public shared ({ caller }) func updateHumanonStats(
    participantsEnrolled : Nat,
    projectsCompleted : Nat,
    industryPartners : Nat,
    careerPlacements : Nat,
    countriesRepresented : Nat,
  ) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update stats");
    };

    humanonStats := {
      participantsEnrolled;
      projectsCompleted;
      industryPartners;
      careerPlacements;
      countriesRepresented;
    };
  };

  // ELPIS Query and Admin functions

  public query ({ caller }) func getElpisCouncilMembers() : async [ElpisCouncilMember] {
    councilMembers.toArray();
  };

  public query ({ caller }) func getElpisGuidanceAreas() : async [ElpisGuidanceArea] {
    guidanceAreas.toArray();
  };

  public query ({ caller }) func getElpisAnnouncements() : async [ElpisAnnouncement] {
    announcements.values().toArray().filter(
      func(announcement) { announcement.isPublic }
    );
  };

  public query ({ caller }) func getAllElpisAnnouncements() : async [ElpisAnnouncement] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all announcements");
    };
    announcements.toArray();
  };

  public shared ({ caller }) func createElpisCouncilMember(
    name : Text,
    domain : Text,
    organization : Text,
    role : Text,
    biography : Text,
    expertise : Text,
  ) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create council members");
    };

    let newMember = {
      id = nextCouncilMemberId;
      name;
      domain;
      organization;
      role;
      biography;
      expertise;
    };

    councilMembers.add(newMember);
    nextCouncilMemberId += 1;
  };

  public shared ({ caller }) func deleteElpisCouncilMember(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete council members");
    };

    let filteredMembers = councilMembers.filter(
      func(member) { member.id != id }
    );

    councilMembers.clear();
    councilMembers.addAll(filteredMembers.values());
  };

  public shared ({ caller }) func createElpisGuidanceArea(
    domain : Text,
    description : Text,
    contribution : Text,
  ) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create guidance areas");
    };

    let newArea = {
      id = nextGuidanceAreaId;
      domain;
      description;
      contribution;
    };

    guidanceAreas.add(newArea);
    nextGuidanceAreaId += 1;
  };

  public shared ({ caller }) func deleteElpisGuidanceArea(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete guidance areas");
    };

    let filteredAreas = guidanceAreas.filter(
      func(area) { area.id != id }
    );

    guidanceAreas.clear();
    guidanceAreas.addAll(filteredAreas.values());
  };

  public shared ({ caller }) func createElpisAnnouncement(
    title : Text,
    summary : Text,
    category : Text,
    isPublic : Bool,
  ) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create announcements");
    };

    let newAnnouncement = {
      id = nextAnnouncementId;
      title;
      summary;
      category;
      isPublic;
      publishedAt = Time.now();
    };

    announcements.add(newAnnouncement);
    nextAnnouncementId += 1;
  };

  public shared ({ caller }) func deleteElpisAnnouncement(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete announcements");
    };

    let filteredAnnouncements = announcements.filter(
      func(announcement) { announcement.id != id }
    );

    announcements.clear();
    announcements.addAll(filteredAnnouncements.values());
  };
};
