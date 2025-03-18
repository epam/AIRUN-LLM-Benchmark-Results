import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageService } from "../../services/page";
import "./Page.styles.css";

interface PageProps {
  url: string;
}

const Page: React.FC<PageProps> = () => {
  const { url } = useParams();
  const [page, setPage] = useState<any>();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchPage = async () => {
      const response = await PageService.getPage(url);
      setPage(response.data);
    };
    fetchPage();
  }, [url]);

  return (
    <div className="page-container">
      {page && (
        <>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
          <div dangerouslySetInnerHTML={{ __html: page.body }}></div>
        </>
      )}
    </div>
  );
};

export default Page;