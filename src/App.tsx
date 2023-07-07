import { useState } from "react";
import "./index.css";
import { cn } from "@/utils";
import { Button } from "@/ui/button";
import { Label } from "@/ui/label";
import { ThemeSwitcher } from "@/feature/theme";
import Root from "../layout/root";

function App() {
  const [count, setCount] = useState(0);
  return (
    <Root>
      <div className="flex flex-col justify-center items-center h-full gap-8">
        <h1 className={cn("text-3xl font-bold underline")}>Hello world!</h1>
        <div className="flex gap-8">
          <Button onClick={() => setCount((v) => v + 1)}>+</Button>
          <p>
            <Label>The current count is</Label>
            {"  "}
            <strong className="text-center bold text-xl">{count}</strong>
          </p>
          <Button onClick={() => setCount((v) => v ? v - 1 : 0)}>-</Button>
          <ThemeSwitcher className="absolute bottom-8 right-8" />
        </div>
      </div>
    </Root>
  );
}

export default App;
