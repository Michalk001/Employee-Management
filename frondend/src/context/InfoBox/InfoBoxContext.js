import React, { useState, useEffect} from "react";
import nextId from "react-id-generator";
import { useTranslation } from "react-i18next";

export const InfoBoxContext = React.createContext({

    addInfo: (text, time) => { },
    Confirm: (msg, callback) => { },
    addListInfo: (list, title, time) => { }
})





export const RenderInfo = (props) => {
    const [isClose, setIsClose] = useState(false);
    const [isRemove, setIsRemove] = useState(false);

    const remove = () => {

        setIsClose(true);
        setTimeout(() => { { setIsRemove(true); props.callback(props.msg.id) } }, 800)


    }


    useEffect(() => {
        if (props.msg.time || props.msg.time !== 0)
            setTimeout(() => { remove() }, props.msg.time*1000)

    }, [isClose, isRemove])

    if (isRemove)
        return (<></>);
    if (!isRemove)
        return (

            <div className={`info-box ${isClose ? "info-box--close" : ""}`}  >
                <div onClick={() => { remove() }} className={`info-box--wrap `}>
                    <div className={`info-box__text `} >
                        {props.msg.text}
                    </div>
                    <div className={`info-box__close `}>
                        <i className="fas fa-times"/>
                    </div>
                </div>
            </div >

        )
}

export const RenderListInfo = (props) => {
    const [isClose, setIsClose] = useState(false);
    const [isRemove, setIsRemove] = useState(false);

    const remove = () => {

        setIsClose(true);
        setTimeout(() => { { setIsRemove(true); props.callback(props.msg.id) } }, 800)


    }


    useEffect(() => {
        if (props.msg.time || props.msg.time !== 0)
            setTimeout(() => { remove() }, props.msg.time*1000)

    }, [isClose, isRemove])

    if (isRemove)
        return (<></>);
    if (!isRemove)
        return (

            <div className={`info-box ${isClose ? "info-box--close" : ""}`}  >
                <div onClick={() => { remove() }} className={`info-box--wrap `}>

                    <div className={`info-box__text `} >
                    
                        {props.msg.title}
                    </div>
                  {props.msg.list && props.msg.list.length !== 0 &&  <div className={`info-box__text `} >
                        <ul>
                            {props.msg.list.map((x, index) => (
                                <li key={`li-${props.msg.id}-${index}`} className="info-box__text--list">
                                    {x}
                                </li>
                            ))}
                        </ul>
                    </div>}
                    <div className={`info-box__close `}>
                        <i className="fas fa-times"/>
                    </div>
                </div>
            </div >

        )
}

export const RenderConfirm = (props) => {
    const { t } = useTranslation('common');
    return (

        <div className={`info-box info-box--fullpage`} >
            <div className={`info-box--wrap info-box--confirm`} >
                <div className={`info-box__text `} >
                    {props.msg}
                </div>
                <div className={`info-box__button-inline `}>
                    <div className={`button `} onClick={() => { props.callback(); props.remove() }}>
                        {t('infoBox.yes')}
                    </div>
                    <div className={`button `} onClick={() => { props.remove() }}>
                        {t('infoBox.no')}
                    </div>
                </div>
            </div>
        </div>

    )

}


export const InfoBoxProvider = (props) => {


    const [information, setInformation] = useState([]);
    const [informationList, setInformationList] = useState([]);
    const [confirmData, setConfirmData] = useState(null)

    const addInfo = (text, time = 0) => {
        setInformation([...information, { msg: { text, id: nextId(), time }, isRemove: false }]);
    }
    const addListInfo = (list, title, time = 0) => {
        setInformationList([...informationList, { msg: { title, list, id: nextId(), time }, isRemove: false }]);
    }
    const Confirm = (msg, callback) => {
        setConfirmData({ msg, callback });
    }



    useEffect(() => {
    }, [informationList])



    const removeFromInformation = (id) => {
        const item = information.find((x) => { return x.msg.id === id })
        if (item != null) {
            item.isRemove = true;
        }
        setInformation(information.filter((x) => { return !x.isRemove  }))
    }

    const removeFromInformationList = (id) => {
        const item = informationList.find((x) => { return x.msg.id === id })
        if (item != null) {
            item.isRemove = true;
        }
        setInformationList(informationList.filter((x) => { return !x.isRemove }))
    }

    const removeConfirm = () => {
        setConfirmData(null)
    }

    return (

        <InfoBoxContext.Provider
            value={
                {
                    addInfo,
                    Confirm,
                    addListInfo
                }
            }>
            <>
                {information.length !== 0 && information.map((x, index) => (
                    <span key={`error-${x.msg.id}`} >
                        {!x.isRemove && < RenderInfo {...x} callback={removeFromInformation} />}
                    </span>
                ))}
                {informationList.length !== 0 && informationList.map((x, index) => (
                    <span key={`error-${x.msg.id}`} >
                        {!x.isRemove && < RenderListInfo {...x} callback={removeFromInformationList} />}
                    </span>
                ))}
                {confirmData &&
                    <RenderConfirm msg={confirmData.msg} callback={confirmData.callback} remove={removeConfirm} />
                }
                {props.children}

            </>
        </InfoBoxContext.Provider>

    )

}