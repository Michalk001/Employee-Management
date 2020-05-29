import {PDFDownloadLink} from "@react-pdf/renderer";
import React, { useState, useEffect, state, useContext, useReducer } from "react";
import { useTranslation } from "react-i18next";
import {ProjectListPDF as Document} from "./teamplet/ProjectListPDF"

const ProjectListPDF = ({ Doc, data, name }) => {
    const { t, i18n } = useTranslation('common');
    return (
        <>
        <PDFDownloadLink
            document={<Document data={data} />}
            fileName={`${name}.pdf`}
            className="button"
        >
            {({ blob, url, loading, error }) =>
                (loading ? t('common.loading') : t('button.reportDownload'))
            }
        </PDFDownloadLink>
        </>
    )

}

export default ProjectListPDF;
