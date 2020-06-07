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


const UserListPDFTemplate = (props) => {

    const {t} = useTranslation('common');
    const users = props.data

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
            marginTop: 10,
            padding: 5,
            width: 530,
            paddingTop: 10,
            paddingBottom: 0

        },
        name: {
            width: 150,
            flexWrap: "wrap",
            fontSize: 18
        },
        hours: {
            width: 50,
            flexWrap: "wrap",
            textAlign: "right",
            fontSize: 18,
            marginRight: 5
        },
        employee: {
            width: 100,
            flexWrap: "wrap",
            textAlign: "right",
            fontSize: 18
        },
        employeeShort: {
            width: 100,
            flexWrap: "wrap",
            textAlign: "right",
            fontSize: 18
        },
        active: {
            width: 100,
            flexWrap: "wrap",
            textAlign: "right",
            fontSize: 18
        }

    })

    const userStatus = (isRetired) => {
        if (isRetired)
            return t('list.statusInactive')
        return t('list.statusActive')
    }

    const getUsersList = (project) => {


        return project.map(item =>
            <View key={item.id} style={styles.projectSection}>
                <View style={styles.row}>
                    <Text style={[styles.name]}>{item.firstname} {item.lastname} </Text>
                    <Text style={[styles.hours]}>{item.hoursTotal} </Text>
                    <Text style={[styles.employee]}>{item.activProjectQuantity} </Text>
                    <Text style={[styles.employeeShort]}>{item.totalProjectQuantity} </Text>
                    <Text style={[styles.active]}>{userStatus(item.isRetired)} </Text>
                </View>

            </View>
        )

    }


    return (
        <Document>
            <Page style={[styles.font, styles.page]}>

                <View style={styles.section}>
                    <View style={styles.row}>
                        <Text style={[styles.title, styles.fontBold]}>
                            {t('list.employeeList')}
                        </Text>
                    </View>
                </View>

                <View style={styles.row}>
                    <Text style={[styles.name]}>{t('list.name')} </Text>
                    <Text style={[styles.hours]}>{t('list.hours')}</Text>
                    <Text style={[styles.employee]}>{t('list.setProject')} </Text>
                    <Text style={[styles.employeeShort]}>{t('list.totalProject')} </Text>
                    <Text style={[styles.active]}>{t('list.status')} </Text>
                </View>
                {getUsersList(users)}
            </Page>
        </Document>
    );
}

const UserListPDF = ({data, name}) => {
    return (<GenerationPDF Doc={UserListPDFTemplate} data={data} name={name}/>)
}
export default UserListPDF