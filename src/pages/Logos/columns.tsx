export const columns: any[] = [
  {
    name: 'logoId',
    title: 'ID',
  },
  {
    name: 'originalname',
    title: 'Name',
  },

  {
    name: 'logo',
    title: 'Logo',
    header: '',
    isColumnFilteringEnabled: false,
    getCellValue: (row: any) => {
      const iconProperties = (
        <>
          <img src={`${row.server}/${row.filename}`} />
        </>
      );

      return iconProperties;
    },
  },
  // {
  //   name: 'copyUrl',
  //   title: 'Copy Url',
  // },
  // { name: 'delete', title: '' },
];
