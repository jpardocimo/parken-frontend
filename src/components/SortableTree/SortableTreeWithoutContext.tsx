import SortableTree, {
  SortableTreeWithoutDndContext,
} from '@nosferatu500/react-sortable-tree';

export * from './default-handlers';
export * from './tree-data-utils';
export default SortableTree;

// Export the tree component without the react-dnd DragDropContext,
// for when component is used with other components using react-dnd.
// see: https://github.com/gaearon/react-dnd/issues/186
export { SortableTreeWithoutDndContext };
