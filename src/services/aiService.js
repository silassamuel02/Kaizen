export function generateInsights({

  workspaces = [],
  notes = [],
  activities = [],

}) {

  const insights = [];

  if (workspaces.length > 0) {

    insights.push({

      type: "Operational Analysis",

      title:
        `${workspaces.length} active operational workspaces detected.`,

      description:
        "Collaborative environments continue expanding across the KAIZEN operational network.",

    });
  }

  if (notes.length > 5) {

    insights.push({

      type: "Behavioral Intelligence",

      title:
        "High cognitive documentation activity observed.",

      description:
        "Operational note density suggests increasing workflow interaction and sustained productivity patterns.",

    });
  }

  if (activities.length > 3) {

    insights.push({

      type: "Realtime Observation",

      title:
        "Realtime operational activity remains stable.",

      description:
        "Collaborative systems continue generating synchronized workflow events without instability indicators.",

    });
  }

  if (insights.length === 0) {

    insights.push({

      type: "Environmental Observation",

      title:
        "Operational systems initializing.",

      description:
        "The KAIZEN intelligence environment is preparing adaptive cognitive analysis systems.",

    });
  }

  return insights;
}