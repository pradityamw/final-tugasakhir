import { Helmet, HelmetProvider } from "react-helmet-async";
import { useGetStoreDataQuery } from "../../state/api/storeApi";

const Title = ({ title }) => {
  const { data } = useGetStoreDataQuery();

  return (
    <HelmetProvider>
      <Helmet>
        <title>{`${data?.name} | ${title}`}</title>
      </Helmet>
    </HelmetProvider>
  );
};

export default Title;
