import { ReactElement, useContext, useEffect, useState } from 'react';
import { RouterContext } from '../contexts/router';

type Route = {
  path: string;
  getNode: (path: string) => ReactElement | null;
  children?: Route[] | undefined;
};

export const useRouter = (routes: Route[]): ReactElement | null => {
  const { path } = useContext(RouterContext);
  const [delayed, setDelayed] = useState(false);

  // delay because we need to wait before parental effects are called
  useEffect(() => {
    setDelayed(true);
  }, []);

  if (!delayed) {
    return null;
  }

  const pathArr = path.split('/');
  let lastPath = '';
  let route: Route | undefined;

  for (let i = 0; i < pathArr.length; i++) {
    lastPath = pathArr[i] as string;
    route = (route?.children || routes).find(
      (route) => route.path === lastPath || route.path === '*',
    );
    if (!route) {
      return null;
    }
  }

  return route?.getNode(lastPath) || null;
};
