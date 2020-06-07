import React from "react";
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,

    Font
} from "@react-pdf/renderer";
import {useTranslation} from "react-i18next";
import {GenerationPDF} from "../GenerationPDF";


const ProjectReportPDFTemplate = (props) => {

    const {t} = useTranslation('common');
    const project = props.data

    Font.register({
        family: 'Rajdhani', fonts: [
            {src: "/font/Rajdhani.ttf"},
            {src: "/font/Rajdhani-Bold.ttf", fontWeight: "bold"},
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
            paddingTop: 10,
            paddingBottom: 0
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

    const getActiveUser = (users) => {
        return users.filter(item => (item.userProjects.isRetired === false && item.userProjects.isRemove === false)).length;

    }

    const getActiveHours = (users) => {
        let hours = 0
        users.filter(item => (item.userProjects.isRetired === false && item.userProjects.isRemove === false)).map(item => {
            hours += item.userProjects.hours
        });
        return hours
    }

    const getOldUser = (users) => {
        return users.filter(item => (item.userProjects.isRetired === true && item.userProjects.isRemove === false)).length;

    }

    const getOldHours = (users) => {
        let hours = 0
        users.filter(item => (item.userProjects.isRetired && item.userProjects.isRemove)).map(item => {
            hours += item.userProjects.hours
        });
        return hours
    }

    const getActiveUserList = (users) => {
        const activeUser = users.filter(item => (item.userProjects.isRetired && item.userProjects.isRemove));

        if (activeUser.length === 0)
            return (<View style={styles.noProject}>
                <View style={styles.row}>
                    <Text>  {t('list.non')}  </Text>
                </View>
            </View>)

        return (<>
            <View style={styles.row}>
                <Text style={[styles.nameTitle, styles.marginLeft]}> {t('list.name')}</Text>
                <Text style={[styles.hours]}> {t('list.hours')} </Text>
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
        const oldUser = projects.filter(item => (item.userProjects.isRetired && !item.userProjects.isRemove));
        if (oldUser.length === 0)
            return (<View style={styles.noProject}>
                <View style={styles.row}>
                    <Text>  {t('list.non')}  </Text>
                </View>
            </View>)

        return (<>
            <View style={styles.row}>
                <Text style={[styles.nameTitle, styles.marginLeft]}> {t('list.name')}</Text>
                <Text style={[styles.hours]}> {t('list.hours')} </Text>
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

        <Document>

            <Page style={[styles.font, styles.page]}>

                <View style={styles.section}>
                    <View style={styles.row}>
                        <Text style={[styles.title, styles.fontBold]}>
                            {t('list.reportProject')}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.marginRight}>
                            {t('list.name')}
                        </Text>
                        <Text style={styles.fontBold}>
                            {` ${project.name}`}
                        </Text>
                    </View>
                    <View style={styles.section}>
                        <Text>   {t('project.description')} </Text>
                        <View style={styles.projectSection}>


                            <Text>{`${project.description}`} </Text>
                        </View>
                    </View>
                </View>


                <View style={styles.row}>
                    <Text style={styles.marginRight}>
                        {t('report.activeHoursEmployee')}
                    </Text>
                    <Text style={styles.fontBold}>
                        {getActiveHours(project.users)}
                    </Text>

                </View>
                <View style={styles.row}>
                    <Text style={styles.marginRight}>
                        {t('report.activeEmployee')}
                    </Text>
                    <Text style={styles.fontBold}>
                        {getActiveUser(project.users)}
                    </Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.marginRight}>
                        {t('report.activeHoursOldEmployee')}
                    </Text>
                    <Text style={styles.fontBold}>
                        {getOldHours(project.users)}
                    </Text>

                </View>

                <View style={styles.row}>
                    <Text style={styles.marginRight}>
                        {t('report.activeOldEmployee')}
                    </Text>
                    <Text style={styles.fontBold}>
                        {getOldUser(project.users)}
                    </Text>
                </View>

                <View style={styles.section}>
                    <View>
                        <Text style={[styles.title, styles.fontBold]}>
                            {t('project.activeEmployee')}
                        </Text>
                        {getActiveUserList(project.users)}
                    </View>
                </View>
                <View style={styles.section}>
                    <View>
                        <Text style={[styles.title, styles.fontBold]}>
                            {t('project.inactiveEmployee')}
                        </Text>
                        {getOldUserList(project.users)}
                    </View>
                </View>


            </Page>
        </Document>
    );
}

const ProjectReportPDF = ({data, name}) => {
    return (<GenerationPDF Doc={ProjectReportPDFTemplate} data={data} name={name}/>)
}
export default ProjectReportPDF