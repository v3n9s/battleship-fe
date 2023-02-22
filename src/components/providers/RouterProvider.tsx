import { FC, ReactNode, useEffect, useState } from 'react';
import { RouterContext } from '../../contexts/router';

const removeLeadingFragmentAndSlash = (url: string) => {
  return url.replace(/^#?\/?/g, '');
};

const RouterProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [path, setPath] = useState(() =>
    removeLeadingFragmentAndSlash(location.hash),
  );

  const setRoute = (route: string) => {
    location.hash = '/' + route;
  };

  useEffect(() => {
    const handler = (e: HashChangeEvent) => {
      setPath(
        removeLeadingFragmentAndSlash(e.newURL.slice(e.newURL.indexOf('#'))),
      );
    };
    window.addEventListener('hashchange', handler);
    return () => {
      window.removeEventListener('hashchange', handler);
    };
  }, []);

  return (
    <RouterContext.Provider value={{ path, setRoute }}>
      {children}
    </RouterContext.Provider>
  );
};

export default RouterProvider;
