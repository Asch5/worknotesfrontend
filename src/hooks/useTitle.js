import { useEffect } from 'react';

const useTitle = (title) => {
    useEffect(() => {
        const prevTitle = document.title;
        document.title = title;
        //whenever the component unmounts the original title comes back
        return () => (document.title = prevTitle);
    }, [title]);
};

export default useTitle;
