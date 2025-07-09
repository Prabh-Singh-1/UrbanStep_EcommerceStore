
"use client";
import LoadingBar from "react-top-loading-bar";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const TopLoader = () => {
  const pathname = usePathname();
  const ref = useRef(null);

  useEffect(() => {
    
    ref.current?.continuousStart();

    const timeout = setTimeout(() => {
      ref.current?.complete();
    }, 300); 

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <LoadingBar
      className="bg-blue-500"
      color="blue"
      ref={ref}
      height={3}
      shadow={true}
      loaderSpeed={500}
      transitionTime={300}
    />
  );
};

export default TopLoader;
