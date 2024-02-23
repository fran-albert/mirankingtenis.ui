import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface IActionIcon {
  icon: any;
  tooltip: string;
  color?: string;
  onClick?: () => void;
  tooltipColor?: any;
}


const ActionIcon = ({
  icon,
  tooltip,
  color,
  onClick,
  tooltipColor,
}: IActionIcon) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`text-lg cursor-pointer active:opacity-50 ${color}`}
            onClick={onClick}
          >
            {icon}
          </div>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ActionIcon;
