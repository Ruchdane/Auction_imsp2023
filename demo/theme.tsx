import { useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

function ThemeDemo() {
  const [count, setCount] = useState(0);
  const decrement = () => setCount((v) => (v ? v - 1 : 0));
  const increment = () => setCount((v) => v + 1);

  return (
    <div className="text-primary flex flex-col justify-center items-center h-full gap-8">
      <h2 className="text-3xl font-bold">Theme Démo!</h2>
      <div className="flex items-center gap-8">
        <div className="flex flex-col gap-8">
          <Button variant="ghost" onClick={decrement}>
            i--
          </Button>
          <Button variant="link" onClick={decrement}>
            i--
          </Button>
          <Button variant="primary" isLoading onClick={increment}>
            {" "}
            i++{" "}
          </Button>
        </div>
        <p className="bg-secondary text-center shadow shadow-md ring rounded-lg px-8 py-16">
          <Label className="text-main">The current count is</Label>
          {"  "}
          <br />
          <strong className="text-center bold text-xl">{count}</strong>
          {"  "}
          <br />
          <Label className="text-muted">This is disabled</Label>
        </p>
        <div className="flex flex-col gap-8">
          <Button variant="primary" onClick={increment}>
            {" "}
            i++{" "}
          </Button>
          <Button variant="secondary" onClick={increment}>
            {" "}
            i++{" "}
          </Button>
          <Button variant="accent" onClick={increment}>
            {" "}
            i++{" "}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ThemeDemo;
