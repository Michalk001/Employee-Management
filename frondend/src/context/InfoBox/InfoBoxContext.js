import React, { useState, useEffect, useRef, state, useContext, useReducer } from "react";
import nextId from "react-id-generator";

export const InfoBoxContext = React.createContext({

    addInfo: (text, time) => { },
    Confirm: (msg, callback) => { }
})





export const RenderInfo = (props) => {
    const [isClose, setIsClose] = useState(false);
    const [isRemove, setIsRemove] = useState(false);

    const remove = () => {

        setIsClose(true);
        setTimeout(() => { { setIsRemove(true); props.callback(props.msg.id) } }, 800)


    }


    useState(() => {
        if (props.msg.time || props.msg.time != 0)
            setTimeout(() => { remove() }, props.msg.time)

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
                        <i className="fas fa-times"></i>
                    </div>
                </div>
            </div >

        )
}


export const RenderConfirm = (props) => {

    return (

        <div className={`info-box info-box--fullpage`} >
            <div className={`info-box--wrap info-box--confirm`} >
                <div className={`info-box__text `} >
                    {props.msg}
                </div>
                <div className={`info-box__button-inline `}>
                    <div className={`button `} onClick={() => { props.callback(); props.remove() }}>
                        Tak
                    </div>
                    <div className={`button `} onClick={() => { props.remove() }}>
                        Nie
                    </div>
                </div>
            </div>
        </div>

    )

}


export const InfoBoxProvider = (props) => {


    const [informationList, setInformationList] = useState([]);
    const [confirmData, setConfirmData] = useState(null)

    const addInfo = (text, time = 0) => {
        setInformationList([...informationList, { msg: { text: text, id: nextId(), time } }]);
    }

    const Confirm = (msg, callback) => {
        setConfirmData({ msg, callback });
    }



    useEffect(() => {
        console.log(informationList)
    }, [informationList])

    useEffect(() => {

    }, [informationList])


    const removeFromList = (id) => {
        setInformationList(informationList.filter((x) => { return x.msg.id != id }))
    }

    const removeConfirm = () => {
        setConfirmData(null)
    }

    return (

        <InfoBoxContext.Provider
            value={
                {
                    addInfo,
                    Confirm
                }
            }>
            <>
                {informationList.length != 0 && informationList.map((x, index) => (
                    <span key={`error-${x.msg.id}`} >
                        < RenderInfo {...x} callback={removeFromList} />
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