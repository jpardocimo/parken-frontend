import React, { useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  listItem: {
    fontSize: '1rem',
  },

  listItemSubtopic: {
    fontSize: '0.5rem',
    lineHeight: '1.25rem',
    marginLeft: '2rem',
    marginRight: '2rem',
  },
});

interface Kpi {
  name: string;
  score: number;
  category: string;
  topics: Kpi[];
  scoreBenchmark?: number;
}

interface Props {
  kpi: Kpi;
  parentKpi?: Kpi;
  grandParentKpi?: Kpi;
  handleApillar: (kpiSelected: Kpi) => void;
  handleTopic: (kpiSelected: Kpi, apillar: Kpi) => void;
  handleSubtopic: (kpiSelected: Kpi, apillar: Kpi, topic: Kpi) => void;
}

const NestedItem: React.FC<Props> = kpiProp => {
  const styleClasses = useStyles();
  const [isOpen, setIsOpen] = useState(false);

  function handleKpiTree(): void {
    if (kpiProp.kpi.category === 'A-Pillar') kpiProp.handleApillar(kpiProp.kpi);
    if (kpiProp.kpi.category === 'Topic' && kpiProp.parentKpi)
      kpiProp.handleTopic(kpiProp.kpi, kpiProp.parentKpi);
    if (
      kpiProp.kpi.category === 'Subtopic' &&
      kpiProp.parentKpi &&
      kpiProp.grandParentKpi
    )
      kpiProp.handleSubtopic(
        kpiProp.kpi,
        kpiProp.grandParentKpi,
        kpiProp.parentKpi,
      );
  }

  function handleIsOpen(): void {
    setIsOpen(prev => !prev);
  }

  return (
    <List>
      <ListItem
        alignItems="center"
        className={
          kpiProp.kpi.category === 'Subtopic'
            ? styleClasses.listItemSubtopic
            : styleClasses.listItem
        }
        button
        onClick={handleIsOpen}
      >
        <ListItemText
          inset={kpiProp.kpi.category !== 'A-Pillar'}
          primary={kpiProp.kpi.name}
          onClick={handleKpiTree}
        />
        {kpiProp.kpi.topics?.some((x: Kpi) => x.category !== 'Question') &&
          (isOpen ? <ExpandLess /> : <ExpandMore />)}
      </ListItem>
      {kpiProp.kpi.topics
        .filter((x: Kpi) => x.category !== 'Question')
        .map((topic: Kpi) => {
          return (
            <Collapse in={isOpen} key={topic.name}>
              {topic?.topics?.length > 0 ? (
                <NestedItem
                  kpi={topic}
                  key={topic.name}
                  parentKpi={kpiProp.kpi}
                  grandParentKpi={kpiProp.parentKpi}
                  handleApillar={kpiProp.handleApillar}
                  handleTopic={kpiProp.handleTopic}
                  handleSubtopic={kpiProp.handleSubtopic}
                ></NestedItem>
              ) : (
                <List>
                  <ListItem button>
                    <ListItemText inset={true} primary={topic.name} />
                  </ListItem>
                </List>
              )}
            </Collapse>
          );
        })}
    </List>
  );
};

export default NestedItem;
