import { ReactNode } from "react";
import { cn } from "../utils";

interface ListProps<T> {
  activeElement: T | null;
  setActiveElement: (element: T) => void;
  elements: T[];
  display: (props: { element: T }) => ReactNode;
}
export default function List<T>(props: ListProps<T>) {
  return (
    <ul className="flex flex-col">
      {props.elements.map((element, key) => (
        <li
          className={cn("p-4 border-b border-contrast hover:bg-accent cursor-pointer", props.activeElement === element && "border-primary bg-primary hover:bg-primary")}
          key={key}
          onClick={(_) => props.setActiveElement(element)}
        >
          {props.display({ element })}
        </li>
      ))}
    </ul>
  );
}
