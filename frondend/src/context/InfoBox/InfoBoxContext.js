import React, { useState, useEffect, useRef, state, useContext, useReducer } from "react";
import nextId from "react-id-generator";

export const InfoBoxContext = React.createContext({

    addInfo: (text) => { }

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

            <div key={`error-${props.msg.id}`} className={`info-box ${isClose ? "info-box--close" : ""}`}  >
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


export const InfoBoxProvider = (props) => {


    const [informationList, setInformationList] = useState([]);


    const addInfo = (text, time = 0) => {
        setInformationList([...informationList, { msg: { text: text, id: nextId(), time } }]);
    }

    useEffect(() => {
        console.log(informationList)
    }, [informationList])

    useEffect(() => {

    }, [informationList])


    const removeFromList = (id) => {
        setInformationList(informationList.filter((x) => { return x.msg.id != id }))
    }

    return (

        <InfoBoxContext.Provider
            value={
                {
                    addInfo,
                }
            }>
            <>
                {informationList.length != 0 && informationList.map((x, index) => (
                    < RenderInfo {...x} callback={removeFromList} />
                ))}

                {props.children}

            </>
        </InfoBoxContext.Provider>

    )

}