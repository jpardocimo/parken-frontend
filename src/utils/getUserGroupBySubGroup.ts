import EnumProductUserGroup from './enums/EnumProductUserGroup';
import EnumProductSubGroup from './enums/EnumProductSubGroup';

export default function getUserGroupBySubGroup(
  subGroup: string,
): string | null {
  switch (subGroup) {
    case EnumProductSubGroup.Employees:
    case EnumProductSubGroup.Management:
      return EnumProductUserGroup.Internal;
    case EnumProductSubGroup.Corporate:
    case EnumProductSubGroup.Retail:
    case EnumProductSubGroup.Wealthy:
      return EnumProductUserGroup.External;
    default:
      return null;
  }
}
