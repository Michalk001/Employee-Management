import {PDFDownloadLink} from "@react-pdf/renderer";
import React from "react";
import {useTranslation} from "react-i18next";


export const GenerationPDF = ({Doc, data, name}) => {
    const {t} = useTranslation('common');
    return (
        <>

            <PDFDownloadLink
                document={<Doc data={data}/>}
                fileName={`${name}.pdf`}
                className="button"
            >
                {({loading}) =>
                    (loading ? t('common.loading') : t('button.reportDownload'))
                }
            </PDFDownloadLink>

        </>
    )

}


