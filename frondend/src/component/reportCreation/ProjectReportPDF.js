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


export const ProjectReportPDF = (props) => {


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
            margin: 10,
            padding: 5,
            width: 530,
            paddingTop:10,
            paddingBottom:0
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

    const getAcviteUser = (users) => {
        return users.filter(item => (item.userProjects.isRetired == false && item.userProjects.isRemove == false)).length;

    }

    const getAcviteHours = (users) => {
        let hours = 0
        users.filter(item => (item.userProjects.isRetired == false && item.userProjects.isRemove == false)).map(item => { hours += item.userProjects.hours });
        return hours
    }

    const getOldUser = (users) => {
        return users.filter(item => (item.userProjects.isRetired == true && item.userProjects.isRemove == false)).length;

    }

    const getOldHours = (users) => {
        let hours = 0
        users.filter(item => (item.userProjects.isRetired == true && item.userProjects.isRemove == false)).map(item => { hours += item.userProjects.hours });
        return hours
    }

    const getActiveUserList = (users) => {
        const activeUser = users.filter(item => (item.userProjects.isRetired == false && item.userProjects.isRemove == false));

        if (activeUser.length == 0)
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
            {activeUser.map(item =>
                <View key={item.id} style={styles.projectSection}>
                    <View style={styles.row}>
                        <Text style={[styles.name]}>
                            {item.firstname} {item.lastname}
                        </Text>
                        <Text style={[styles.hours]}>
                            {`${item.userProjects.hours}`}
                        </Text>
                    </View>

                </View>

            )}
        </>)



    }


    const getOldUserList = (projects) => {
        const oldUser= projects.filter(item => (item.userProjects.isRetired == true && item.userProjects.isRemove == false));
        if (oldUser.length == 0)
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
            {oldUser.map(item =>
                <View key={item.id} style={styles.projectSection}>
                    <View style={styles.row}>
                        <Text style={[styles.name]}>
                            {item.firstname} {item.lastname}
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
                            Raport Projektu
                        </Text>
                    </View>
                    <View style={styles.row} >
                        <Text style={styles.marginRight}>
                            Nazwa
                            </Text>
                        <Text style={styles.fontBold}>
                            {` ${project.name}`}
                        </Text>
                    </View>
                    <View style={styles.section}>
                        <Text> Opis </Text>
                        <View style={styles.projectSection}>


                            <Text >{`${project.description}`} </Text>
                        </View>
                    </View>
                </View>


                <View style={styles.row} >
                    <Text style={styles.marginRight}>
                        Liczba godzin przydzelonych pracowników
                            </Text>
                    <Text style={styles.fontBold}>
                        {getAcviteHours(project.users)}
                    </Text>

                </View>
                <View style={styles.row} >
                    <Text style={styles.marginRight}>
                        Liczba przydzielonych pracowników
                        </Text>
                    <Text style={styles.fontBold}>
                        {getAcviteUser(project.users)}
                    </Text>
                </View>
                <View style={styles.row} >
                    <Text style={styles.marginRight}>
                        Liczba godzin spędzonych przy nieaktywnych projektach
                            </Text>
                    <Text style={styles.fontBold}>
                        {getOldHours(project.users)}
                    </Text>

                </View>

                <View style={styles.row} >
                    <Text style={styles.marginRight}>
                        Liczba nieaktywnych projektow
                        </Text>
                    <Text style={styles.fontBold}>
                        {getOldUser(project.users)}
                    </Text>
                </View>

                <View style={styles.section}>
                    <View >
                        <Text style={[styles.title, styles.fontBold]}>
                            Przydzieleni pracownicy
                            </Text>
                        {getActiveUserList(project.users)}
                    </View>
                </View>
                <View style={styles.section}>
                    <View >
                        <Text style={[styles.title, styles.fontBold]}>
                            Nieaktywni pracownicy
                            </Text>
                        {getOldUserList(project.users)}
                    </View>
                </View>



            </Page>
        </Document >
    );
}

