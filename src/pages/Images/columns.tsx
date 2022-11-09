export const columns: any[] = [
  {
    name: 'imageId',
    title: 'ID',
  },
  {
    name: 'originalname',
    title: 'Name',
  },

  {
    name: 'image',
    title: 'Images',
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
  {
    name: 'copyUrl',
    title: 'Copy Url',
  },
  // { name: 'delete', title: '' },
];
