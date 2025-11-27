import { StateGraph, Annotation, END, START } from '@langchain/langgraph';

import { RequestEmail } from 'src/handlers/generation';
import { classifyEmail } from './nodes/ClassifyEmail';
import { Agent } from '@/types/agent.types';
import { ClassificationTypes } from '@/constants/ClassificationTypes';
import logger from '@/utils/logger';

// Import response nodes
import { interestedResponse } from './nodes/edges/InterestedResponse';
import { notInterestedResponse } from './nodes/edges/NotInterestedResponse';
import { wrongPersonResponse } from './nodes/edges/WrongPersonResponse';
import { checkBackLaterResponse } from './nodes/edges/CheckBackLaterResponse';
import { personalizeEmail } from './nodes/PersonalizeEmail';
import { structureEmail } from './nodes/StructureEmail';

// Graph state
const StateAnnotation = Annotation.Root({
  email: Annotation<RequestEmail>,
  agent: Annotation<Agent>,
  prompt: Annotation<string>,
  classify: Annotation<string>,
  generate: Annotation<any>,
});

// Router function to determine which node to call based on classification
const routeByClassification = (state: { classify: string }): string => {
  const classification = state.classify.trim();

  logger.info(`Routing based on classification: ${classification}`);

  // Map classifications to node names
  switch (classification) {
    case ClassificationTypes.INTERESTED:
      return 'interestedNode';
    case ClassificationTypes.NOT_INTERESTED:
      return 'notInterestedNode';
    case ClassificationTypes.WRONG_PERSON:
      return 'wrongPersonNode';
    case ClassificationTypes.CHECK_BACK_LATER:
      return 'checkBackLaterNode';
    case ClassificationTypes.FOLLOW_UP:
      return 'followUpNode';
    default:
      logger.warn(`Unknown classification: ${classification}, defaulting to interested`);
      return 'interestedNode';
  }
};

// Define the workflow graph
const workflow = new StateGraph(StateAnnotation)
  .addNode('personalizeNode', personalizeEmail)
  .addNode('classifyNode', classifyEmail)
  .addNode('structureNode', structureEmail)

  // Add response nodes for each classification type
  .addNode('interestedNode', interestedResponse)
  .addNode('notInterestedNode', notInterestedResponse)
  .addNode('wrongPersonNode', wrongPersonResponse)
  .addNode('checkBackLaterNode', checkBackLaterResponse)

  .addEdge(START, 'personalizeNode')
  .addEdge('personalizeNode', 'classifyNode')

  // After personalization, use conditional routing based on classification
  .addConditionalEdges('classifyNode', routeByClassification, {
    interestedNode: 'interestedNode',
    notInterestedNode: 'notInterestedNode',
    wrongPersonNode: 'wrongPersonNode',
    checkBackLaterNode: 'checkBackLaterNode',
  })

  // All response nodes end the workflow
  .addEdge('interestedNode', 'structureNode')
  .addEdge('notInterestedNode', 'structureNode')
  .addEdge('wrongPersonNode', 'structureNode')
  .addEdge('checkBackLaterNode', 'structureNode')
  .addEdge('structureNode', END);

// Compile and export the graph
export const emailWorkflow = workflow.compile();
