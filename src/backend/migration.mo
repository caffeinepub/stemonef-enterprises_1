import List "mo:core/List";
import Nat "mo:core/Nat";

module {
  // Types for old actor state (without Humanon fields)
  type OldFeedEntry = {
    id : Nat;
    title : Text;
    summary : Text;
    domain : Text;
    isPublic : Bool;
    isFeatured : Bool;
    timestamp : Int;
  };

  type OldFeed = List.List<OldFeedEntry>;

  type OldCollaborator = {
    id : Nat;
    name : Text;
    email : Text;
    pathway : Text;
    message : Text;
    timestamp : Int;
  };

  type OldCollaborationRequest = List.List<OldCollaborator>;

  type OldPathwayInterest = {
    pathway : Text;
    timestamp : Int;
  };

  type OldPathwayInterests = List.List<OldPathwayInterest>;

  type OldActor = {
    feeds : OldFeed;
    collaborationRequests : OldCollaborationRequest;
    pathwayInterests : OldPathwayInterests;
    nextFeedId : Nat;
    nextCollabReqId : Nat;
  };

  // Types for new actor state (with Humanon fields)
  type NewFeedEntry = OldFeedEntry;
  type NewFeed = OldFeed;

  type NewCollaborator = OldCollaborator;
  type NewCollaborationRequest = OldCollaborationRequest;

  type NewPathwayInterest = OldPathwayInterest;
  type NewPathwayInterests = OldPathwayInterests;

  type NewHumanonMentor = {
    id : Nat;
    name : Text;
    domain : Text;
    organization : Text;
    role : Text;
    profileUrl : Text;
  };

  type NewHumanonProject = {
    id : Nat;
    title : Text;
    researchDomain : Text;
    participantTeam : Text;
    summary : Text;
    outcome : Text;
    mentorsInvolved : Text;
    publishedAt : Int;
  };

  type NewHumanonPartner = {
    id : Nat;
    name : Text;
    sector : Text;
    description : Text;
  };

  type NewHumanonStats = {
    participantsEnrolled : Nat;
    projectsCompleted : Nat;
    industryPartners : Nat;
    careerPlacements : Nat;
    countriesRepresented : Nat;
  };

  type NewActor = {
    feeds : NewFeed;
    collaborationRequests : NewCollaborationRequest;
    pathwayInterests : NewPathwayInterests;
    humanonMentors : List.List<NewHumanonMentor>;
    humanonProjects : List.List<NewHumanonProject>;
    humanonPartners : List.List<NewHumanonPartner>;
    humanonStats : NewHumanonStats;
    nextFeedId : Nat;
    nextCollabReqId : Nat;
    nextProjectId : Nat;
    nextPartnerId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let humanonMentors = List.fromArray<NewHumanonMentor>(
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

    let humanonProjects = List.fromArray<NewHumanonProject>(
      [
        {
          id = 1;
          title = "Urban Heat Mapping Initiative";
          researchDomain = "Climate Systems";
          participantTeam = "Aisha Ndoye, Karan Mehta, Sofia Alves";
          summary = "Mapping urban heat islands across 12 cities";
          outcome = "Dataset adopted by 3 municipal governments";
          mentorsInvolved = "Dr. Amara Osei, Dr. Mei-Lin Zhao";
          publishedAt = 0;
        },
        {
          id = 2;
          title = "Bias Detection in Healthcare AI";
          researchDomain = "Ethical AI";
          participantTeam = "Zara Ahmed, Liu Wei, Carlos Hernandez";
          summary = "Framework for bias detection in clinical AI";
          outcome = "Open-source adoption in multiple platforms";
          mentorsInvolved = "Prof. Lena Richter, Dr. Rani Patel";
          publishedAt = 0;
        },
        {
          id = 3;
          title = "Coastal Resilience Data Network";
          researchDomain = "Environmental Intelligence";
          participantTeam = "Olumide Bello, Priya Sharma, Thomas Müller";
          summary = "Distributed IoT sensor network for coastal data";
          outcome = "Policy citation and ecosystem adaptation";
          mentorsInvolved = "Dr. Mei-Lin Zhao, James Okoro";
          publishedAt = 0;
        },
        {
          id = 4;
          title = "Explainable Neural Decision Systems";
          researchDomain = "Cognitive AI";
          participantTeam = "Fatima Al-Hassan, Erik Lindqvist";
          summary = "Enhanced interpretability tooling for neural networks";
          outcome = "STEAMI adoption for global model deployment";
          mentorsInvolved = "Prof. Samuel Torres, Prof. Lena Richter";
          publishedAt = 0;
        },
      ]
    );

    let humanonPartners = List.fromArray<NewHumanonPartner>(
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

    let humanonStats = {
      participantsEnrolled = 30;
      projectsCompleted = 12;
      industryPartners = 8;
      careerPlacements = 24;
      countriesRepresented = 6;
    };

    {
      old with
      humanonMentors;
      humanonProjects;
      humanonPartners;
      humanonStats;
      nextProjectId = 5;
      nextPartnerId = 5;
    };
  };
};
