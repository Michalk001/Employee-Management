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


const UserReportPDFTemplate = (props) => {

    const {t} = useTranslation('common');
    const user = props.data

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

    const getActiveProject = (projects) => {
        return projects.filter(item => (!item.userProjects.isRetired && !item.userProjects.isRemove)).length;

    }

    const getActiveHours = (projects) => {
        let hours = 0
        projects.filter(item => (!item.userProjects.isRetired && !item.userProjects.isRemove)).map(item => {
            hours += item.userProjects.hours
        });
        return hours
    }

    const getOldProject = (projects) => {
        return projects.filter(item => (item.userProjects.isRetired && !item.userProjects.isRemove)).length;

    }

    const getOldHours = (projects) => {
        let hours = 0
        projects.filter(item => (item.userProjects.isRetired && !item.userProjects.isRemove)).map(item => {
            hours += item.userProjects.hours
        });
        return hours
    }

    const getActiveProjectList = (projects) => {
        const activeProject = projects.filter(item => (!item.userProjects.isRetired && !item.userProjects.isRemove));

        if (activeProject.length === 0)
            return (<View style={styles.noProject}>
                <View style={styles.row}>
                    <Text> {t('project.non')}  </Text>
                </View>
            </View>)

        return (<>
            <View style={styles.row}>
                <Text style={[styles.nameTitle, styles.marginLeft]}>{t('project.name')}</Text>
                <Text style={[styles.hours]}>{t('list.hours')} </Text>
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
        const oldProject = projects.filter(item => (item.userProjects.isRetired && !item.userProjects.isRemove));
        if (oldProject.length === 0)
            return (<View style={styles.noProject}>
                <View style={styles.row}>
                    <Text> {t('project.non')}  </Text>
                </View>
            </View>)

        return (<>
            <View style={styles.row}>
                <Text style={[styles.nameTitle, styles.marginLeft]}>{t('project.name')}</Text>
                <Text style={[styles.hours]}>{t('list.hours')} </Text>
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

        <Document>

            <Page style={[styles.font, styles.page]}>

                <View style={styles.section}>
                    <View style={styles.row}>
                        <Text style={[styles.title, styles.fontBold]}>
                            {t('report.employeeReport')}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.marginRight}>
                            {t('user.phone')}
                        </Text>
                        <Text style={styles.fontBold}>
                            {user.phone ? `${user.phone}` : t('list.non')}
                        </Text>

                    </View>
                    <View style={styles.row}>
                        <Text style={styles.marginRight}>
                            {t('user.email')}
                        </Text>
                        <Text style={styles.fontBold}>
                            {`${user.email}`}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.marginRight}>
                            {t('user.userData')}
                        </Text>
                        <Text style={styles.fontBold}>
                            {` ${user.firstname} ${user.lastname}`}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.marginRight}>
                            {t('report.activeProjectHours')}
                        </Text>
                        <Text style={styles.fontBold}>
                            {getActiveHours(user.projects)}
                        </Text>

                    </View>
                    <View style={styles.row}>
                        <Text style={styles.marginRight}>
                            {t('report.activeProject')}

                        </Text>
                        <Text style={styles.fontBold}>
                            {getActiveProject(user.projects)}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.marginRight}>
                            {t('report.inactiveProjectHours')}
                        </Text>
                        <Text style={styles.fontBold}>
                            {getOldHours(user.projects)}
                        </Text>

                    </View>
                    <View style={styles.row}>
                        <Text style={styles.marginRight}>
                            {t('report.inactiveProject')}
                        </Text>
                        <Text style={styles.fontBold}>
                            {getOldProject(user.projects)}
                        </Text>
                    </View>
                </View>
                <View style={styles.section}>
                    <View>
                        <Text style={[styles.title, styles.fontBold]}>
                            {t('dashboard.activeProject')}
                        </Text>
                        {getActiveProjectList(user.projects)}
                    </View>
                </View>
                <View style={styles.section}>
                    <View>
                        <Text style={[styles.title, styles.fontBold]}>
                            {t('common.inactiveProject')}
                        </Text>
                        {getOldProjectList(user.projects)}
                    </View>
                </View>


            </Page>
        </Document>
    );
}

const UserReportPDF = ({data, name}) => {
    return (<GenerationPDF Doc={UserReportPDFTemplate} data={data} name={name}/>)
}
export default UserReportPDF