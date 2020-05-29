import React, { useState, useEffect, state } from "react";
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Image,
    Font
} from "@react-pdf/renderer";
import { useTranslation } from "react-i18next";


export const UserProjectListPDF = (props) => {

    const { t, i18n } = useTranslation('common');
    const project = props.data
    
    Font.register({
        family: 'Rajdhani', fonts: [
            { src: "/font/Rajdhani.ttf" },
            { src: "/font/Rajdhani-Bold.ttf", fontWeight: "bold" },
        ]
    });
    const styles = StyleSheet.create({
        font: {
            fontFamily: 'Rajdhani'
        },
        page: {
            backgroundColor: "#ffffff",
            margin: 20,
        },
        fontBold: {
            fontFamily: 'Rajdhani',
            fontWeight: "bold"
        },
        row: {
            flexDirection: "row",
            display: "flex"

        },
        marginRight: {
            marginRight: 5
        },
        marginLeft: {
            marginLeft: 5
        },
        section: {
            marginTop: 10
        },
        title: {
            fontSize: 20
        },
        projectSection: {
            backgroundColor: "#e0e0e0;",
            marginTop: 10,
            padding: 5,
            width: 530,
            paddingTop:10,
            paddingBottom:0

        },
        name: {
            width: 290,
            flexWrap: "wrap",
            fontSize:18
        },
        hours: {
            width: 100,
            flexWrap: "wrap",
            textAlign: "right",
 
        },
        active: {
            width: 100,
            flexWrap: "wrap",
            textAlign: "right",
            fontSize:18
        }

    })

    const projectStatus = (isRetired) => {
        if (isRetired)
            return t('list.statusInactive')
        return t('list.statusActive')

    }

    const getProjectList = (project) => {
        return project.map(item =>
            <View key={item.id} style={styles.projectSection}>
                <View style={styles.row}>
                    <Text style={[styles.name]}>{item.name}  </Text>
                    <Text style={[styles.hours]}>{item.hours} </Text>
                    <Text style={[styles.active]}>{projectStatus(item.isRetired)} </Text>
                </View>

            </View>

        )

    }



    return (

        <Document  >

            <Page style={[styles.font, styles.page]}>

                <View style={styles.section}>
                    <View style={styles.row} >
                        <Text style={[styles.title, styles.fontBold]}>
                            {t('list.projectList')}
                        </Text>
                    </View>
                </View>

                <View style={styles.row}>
                    <Text style={[styles.name]}>{t('list.name')}</Text>
                    <Text style={[styles.hours]}> {t('list.hours')}</Text>
                    <Text style={[styles.active]}>{t('list.status')}</Text>
                </View>

                {getProjectList(project)}

            </Page>
        </Document >
    );
}

