import AirplaneTicketTwoToneIcon from "@mui/icons-material/AirplaneTicketTwoTone";
import BedTwoToneIcon from "@mui/icons-material/BedTwoTone";
import DirectionsBusFilledTwoToneIcon from "@mui/icons-material/DirectionsBusFilledTwoTone";
import FastfoodTwoToneIcon from "@mui/icons-material/FastfoodTwoTone";
import LocalMallTwoToneIcon from "@mui/icons-material/LocalMallTwoTone";
import TollTwoToneIcon from "@mui/icons-material/TollTwoTone";
import { EXPNSE_CATEGORY } from "../_constants";
import { SxProps, Theme } from "@mui/material";
interface CategoryTagProps {
  category: keyof typeof EXPNSE_CATEGORY;
  withDescription?: boolean;
  sx?: SxProps<Theme>;
}
const CategoryTag = ({
  category,
  withDescription = false,
  sx,
}: CategoryTagProps) => {
  return (
    <>
      {
        {
          LODGMENT: <BedTwoToneIcon {...{ sx }} />,
          FOOD: <FastfoodTwoToneIcon {...{ sx }} />,
          AIRFARE: <AirplaneTicketTwoToneIcon {...{ sx }} />,
          SHOPPING: <LocalMallTwoToneIcon {...{ sx }} />,
          TRAFFIC: <DirectionsBusFilledTwoToneIcon {...{ sx }} />,
          ETC: <TollTwoToneIcon {...{ sx }} />,
        }[category]
      }
      {withDescription && (
        <span className="text-sm">{EXPNSE_CATEGORY[category]}</span>
      )}
    </>
  );
};

export default CategoryTag;
