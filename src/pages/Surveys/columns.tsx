/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import EnumProductSubGroup from '../../utils/enums/EnumProductSubGroup';

export const columns: any[] = [
  { name: 'isLockedIcon', title: 'Locked' },
  {
    name: 'surveyId',
    title: 'ID',
  },
  {
    name: 'projectName',
    title: 'Project',
  },
  {
    name: 'name',
    title: 'Name',
  },
  {
    name: 'title',
    title: 'Title',
  },
  {
    name: 'subGroup',
    title: 'Sub Group',
    getCellValue: (row: any): any => {
      let stringSubGroup = '';
      switch (row.subGroup) {
        case Object.keys(EnumProductSubGroup)[
          Object.values(EnumProductSubGroup).indexOf(
            EnumProductSubGroup.Employees,
          )
        ]:
          stringSubGroup = EnumProductSubGroup.Employees;
          break;
        case Object.keys(EnumProductSubGroup)[
          Object.values(EnumProductSubGroup).indexOf(
            EnumProductSubGroup.Corporate,
          )
        ]:
          stringSubGroup = EnumProductSubGroup.Corporate;
          break;
        case Object.keys(EnumProductSubGroup)[
          Object.values(EnumProductSubGroup).indexOf(
            EnumProductSubGroup.Management,
          )
        ]:
          stringSubGroup = EnumProductSubGroup.Management;
          break;
        case Object.keys(EnumProductSubGroup)[
          Object.values(EnumProductSubGroup).indexOf(EnumProductSubGroup.Retail)
        ]:
          stringSubGroup = EnumProductSubGroup.Retail;
          break;
        case Object.keys(EnumProductSubGroup)[
          Object.values(EnumProductSubGroup).indexOf(
            EnumProductSubGroup.Wealthy,
          )
        ]:
          stringSubGroup = EnumProductSubGroup.Wealthy;
          break;
        default:
          stringSubGroup = row.subGroup;
          break;
      }

      return <span key={row.surveyId}>{stringSubGroup}</span>;
    },
  },
  { name: 'edit', title: '' },
];
