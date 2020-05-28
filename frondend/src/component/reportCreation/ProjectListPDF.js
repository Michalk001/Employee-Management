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


export const ProjectListPDF = (props) => {


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
            width: 150,
            flexWrap: "wrap",
            fontSize:18
        },
        hours: {
            width: 50,
            flexWrap: "wrap",
            textAlign: "right",
            fontSize:18
        },
        employe: {
            width: 100,
            flexWrap: "wrap",
            textAlign: "right",
            fontSize:18
        },
        employeShort: {
            width: 100,
            flexWrap: "wrap",
            textAlign: "right",
            fontSize:18
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
            return "Nieaktywny"
        return "Aktywny"
    }

    const getProjectList = (project) => {


        return project.map(item =>
            <View key={item.id} style={styles.projectSection}>
                <View style={styles.row}>
                    <Text style={[styles.name]}>{item.name}  </Text>
                    <Text style={[styles.hours]}>{item.hoursTotal} </Text>
                    <Text style={[styles.employe]}>{item.activUserQuantity} </Text>
                    <Text style={[styles.employeShort]}>{item.hoursRetiredUser} </Text>
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
                            Lista Projektów
                        </Text>
                    </View>
                </View>

                <View style={styles.row}>
                    <Text style={[styles.name]}>Nazwa </Text>
                    <Text style={[styles.hours]}>Godziny</Text>
                    <Text style={[styles.employe]}>Przydzieleni Pracownicy </Text>
                    <Text style={[styles.employeShort]}>Nieaktywni Pracownicy </Text>
                    <Text style={[styles.active]}>Status </Text>
                </View>

                {getProjectList(project)}

            </Page>
        </Document >
    );
}

