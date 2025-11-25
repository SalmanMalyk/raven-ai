import { StateGraph, Annotation, END } from '@langchain/langgraph';

import { RequestEmail } from 'src/handlers/generation';
import { classifyEmail } from './nodes/ClassifyEmail';
import { personalizeEmail } from './nodes/PersonalizeEmail';
import { generateEmail } from './nodes/GenerateEmail';

// Graph state
const StateAnnotation = Annotation.Root({
  email: Annotation<RequestEmail>,
  classify: Annotation<string>,
  personalize: Annotation<string>,
  generate: Annotation<string>,
});

// Define the workflow graph
const workflow = new StateGraph(StateAnnotation)
  .addNode('classifyNode', classifyEmail)
  .addNode('personalizeNode', personalizeEmail)
  .addNode('generateNode', generateEmail)
  .addEdge('__start__', 'classifyNode')
  .addEdge('classifyNode', 'personalizeNode')
  .addEdge('personalizeNode', 'generateNode')
  .addEdge('generateNode', END);

// Compile and export the graph
export const emailWorkflow = workflow.compile();
