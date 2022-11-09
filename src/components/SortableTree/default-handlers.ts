/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export function defaultGetNodeKey({ treeIndex }: any): any {
  return treeIndex;
}

// Cheap hack to get the text of a react object
function getReactElementText(
  parent: { props: { children: any[] } } | null,
): any {
  if (typeof parent === 'string') {
    return parent;
  }

  if (
    parent === null ||
    typeof parent !== 'object' ||
    !parent.props ||
    !parent.props.children ||
    (typeof parent.props.children !== 'string' &&
      typeof parent.props.children !== 'object')
  ) {
    return '';
  }

  if (typeof parent.props.children === 'string') {
    return parent.props.children;
  }

  return parent.props.children
    .map((child: any) => getReactElementText(child))
    .join('');
}

// Search for a query string inside a node property
function stringSearch(
  key: string,
  searchQuery: string,
  node: { [x: string]: any },
  path: any,
  treeIndex: any,
): any {
  if (typeof node[key] === 'function') {
    // Search within text after calling its function to generate the text
    return (
      String(node[key]({ node, path, treeIndex })).indexOf(searchQuery) > -1
    );
  }
  if (typeof node[key] === 'object') {
    // Search within text inside react elements
    return getReactElementText(node[key]).indexOf(searchQuery) > -1;
  }

  // Search within string
  return node[key] && String(node[key]).indexOf(searchQuery) > -1;
}

export function defaultSearchMethod({
  node,
  path,
  treeIndex,
  searchQuery,
}: any): any {
  return (
    stringSearch('title', searchQuery, node, path, treeIndex) ||
    stringSearch('subtitle', searchQuery, node, path, treeIndex)
  );
}
