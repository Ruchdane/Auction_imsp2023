import { Timestamp } from "firebase/firestore";
import { formatTime, getTimeRemaining, useEndAuction } from "../feature/auction";
import { useEffect, useState } from "react";
import { Auction } from "../domain/types/auction";

export function Timer(props: { endTime: Timestamp , auction : Auction}) {
  const endDate = props.endTime.toDate();
  const [timeRemaining, setTimeRemaining] = useState<string>(
    formatTime(getTimeRemaining(endDate)),
  );
  useEndAuction(timeRemaining,props.auction);

  useEffect(() => {
    // Mettre à jour le temps restant toutes les 100 millisecondes
    const interval = setInterval(() => {
      const remaining = getTimeRemaining(endDate);
      setTimeRemaining(formatTime(remaining));
    }, 100);
    return () => {
      clearInterval(interval);
    };
  }, [endDate]);

  // Retourner le temps restant au format mm:ss:mmm
  return <> {timeRemaining} </>;
}

