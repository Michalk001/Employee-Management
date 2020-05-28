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


export const UserReportPDF = (props) => {


    const user = props.data

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
            margin: 10,
            padding: 5,
            width: 530

        },
        name: {
            width: 300,
            flexWrap: "wrap",
            fontSize: 18,
            marginLeft: 5
        },
        nameTitle: {
            width: 300,
            flexWrap: "wrap",
            fontSize: 18,
            marginLeft: 20,
            paddingLeft: 10
        },
        hours: {
            width: 200,
            flexWrap: "wrap",
            textAlign: "right",
            fontSize: 18,
            marginRight: 5
        },
        noProject: {
            marginLeft: 40
        }

    })

    const getAcviteProject = (projects) => {
        return projects.filter(item => (item.userProjects.isRetired == false && item.userProjects.isRemove == false)).length;

    }

    const getAcviteHours = (projects) => {
        let hours = 0
        projects.filter(item => (item.userProjects.isRetired == false && item.userProjects.isRemove == false)).map(item => { hours += item.userProjects.hours });
        return hours
    }

    const getOldProject = (projects) => {
        return projects.filter(item => (item.userProjects.isRetired == true && item.userProjects.isRemove == false)).length;

    }

    const getOldHours = (projects) => {
        let hours = 0
        projects.filter(item => (item.userProjects.isRetired == true && item.userProjects.isRemove == false)).map(item => { hours += item.userProjects.hours });
        return hours
    }

    const getActiveProjectList = (projects) => {
        const activeProject = projects.filter(item => (item.userProjects.isRetired == false && item.userProjects.isRemove == false));

        if (activeProject.length == 0)
            return (<View style={styles.noProject}>
                <View style={styles.row}>
                    <Text> Brak  </Text>
                </View>
            </View>)

        return (<>
            <View style={styles.row}>
                <Text style={[styles.nameTitle, styles.marginLeft]}>Nazwa</Text>
                <Text style={[styles.hours]}>{`Liczba godzin`} </Text>
            </View>
            {activeProject.map(item =>
                <View key={item.id} style={styles.projectSection}>
                    <View style={styles.row}>
                        <Text style={[styles.name]}>
                            {item.name}
                        </Text>
                        <Text style={[styles.hours]}>
                            {`${item.userProjects.hours}`}
                        </Text>
                    </View>

                </View>

            )}
        </>)
    }


    const getOldProjectList = (projects) => {
        const oldProject = projects.filter(item => (item.userProjects.isRetired == true && item.userProjects.isRemove == false));
        if (oldProject.length == 0)
            return (<View style={styles.noProject}>
                <View style={styles.row}>
                    <Text> Brak  </Text>
                </View>
            </View>)

        return (<>
            <View style={styles.row}>
                <Text style={[styles.nameTitle, styles.marginLeft]}>Nazwa</Text>
                <Text style={[styles.hours]}>{`Liczba godzin`} </Text>
            </View>
            {oldProject.map(item =>
                <View key={item.id} style={styles.projectSection}>
                    <View style={styles.row}>
                        <Text style={[styles.name]}>
                            {item.name}
                        </Text>
                        <Text style={[styles.hours]}>
                            {`${item.userProjects.hours}`}
                        </Text>
                    </View>

                </View>

            )}
        </>)

    }

    return (

        <Document  >

            <Page style={[styles.font, styles.page]}>

                <View style={styles.section}>
                    <View style={styles.row} >
                        <Text style={[styles.title, styles.fontBold]}>
                            Raport Pacownika
                            </Text>
                    </View>
                    <View style={styles.row} >
                        <Text style={styles.marginRight}>
                            Numer telefonu
                            </Text>
                        <Text style={styles.fontBold}>
                            {user.phone ? `${user.phone}` : `Brak`}
                        </Text>

                    </View>
                    <View style={styles.row}>
                        <Text style={styles.marginRight}>
                            Adres email
                            </Text>
                        <Text style={styles.fontBold}>
                            {`${user.email}`}
                        </Text>
                    </View>
                    <View style={styles.row} >
                        <Text style={styles.marginRight}>
                            Dane Pracownika
                            </Text>
                        <Text style={styles.fontBold}>
                            {` ${user.firstname} ${user.lastname}`}
                        </Text>
                    </View>
                    <View style={styles.row} >
                        <Text style={styles.marginRight}>
                            Liczba godzin przy przydzielonych projektach
                            </Text>
                        <Text style={styles.fontBold}>
                            {getAcviteHours(user.projects)}
                        </Text>

                    </View>
                    <View style={styles.row} >
                        <Text style={styles.marginRight}>
                            Liczba przydzielonych projektow
                        </Text>
                        <Text style={styles.fontBold}>
                            {getAcviteProject(user.projects)}
                        </Text>
                    </View>
                    <View style={styles.row} >
                        <Text style={styles.marginRight}>
                            Liczba godzin przy nieaktywnych projektach
                            </Text>
                        <Text style={styles.fontBold}>
                            {getOldHours(user.projects)}
                        </Text>

                    </View>
                    <View style={styles.row} >
                        <Text style={styles.marginRight}>
                            Liczba nieaktywnych projektow
                        </Text>
                        <Text style={styles.fontBold}>
                            {getOldProject(user.projects)}
                        </Text>
                    </View>
                </View>
                <View style={styles.section}>
                    <View >
                        <Text style={[styles.title, styles.fontBold]}>
                            Aktywne projekty
                            </Text>
                        {getActiveProjectList(user.projects)}
                    </View>
                </View>
                <View style={styles.section}>
                    <View >
                        <Text style={[styles.title, styles.fontBold]}>
                            Nieaktywne projekty
                            </Text>
                        {getOldProjectList(user.projects)}
                    </View>
                </View>



            </Page>
        </Document>
    );
}

