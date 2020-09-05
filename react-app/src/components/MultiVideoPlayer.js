import React, {useEffect, useState} from "react";
import SingleVideoPlayer from "./SingleVideoPlayer";
import md5 from 'md5';


const MultiVideoPlayer = ({ srcList, onPause, onPlay }) => {
    const [localSrcList, setLocalSrcList] = useState(srcList);
    useEffect(() => setLocalSrcList(srcList), [srcList]);
    return localSrcList.map((src) =>(<span className="row-item" key={md5(src)}><SingleVideoPlayer key={md5(src)} url={src} onPause={onPause} onPlay={onPlay}/></span>));
}

export default MultiVideoPlayer;