import { Agent } from '@/types/agent.types';
import { StateGraph, Annotation, END, START } from '@langchain/langgraph';
import { personalizeEmail } from './nodes/PersonalizeEmail';
import { followUpResponse } from './nodes/edges/FollowUpResponse';
import { structureEmail } from './nodes/StructureEmail';
import { RequestEmail } from '@/handlers/generation';

const StateAnnotation = Annotation.Root({
  thread_id: Annotation<string>,
  followup_number: Annotation<number>,
  history: Annotation<any>,
  email: Annotation<RequestEmail>,
  agent: Annotation<Agent>,
  prompt: Annotation<string>,
  classify: Annotation<string>,
  generate: Annotation<any>,
});

const workflow = new StateGraph(StateAnnotation)
  .addNode('personalizeEmailNode', personalizeEmail)
  .addNode('followUpResponseNode', followUpResponse)
  .addNode('structureEmailNode', structureEmail)
  .addEdge(START, 'personalizeEmailNode')
  .addEdge('personalizeEmailNode', 'followUpResponseNode')
  .addEdge('followUpResponseNode', 'structureEmailNode')
  .addEdge('structureEmailNode', END);

export const followupWorkflow = workflow.compile();
