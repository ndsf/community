import React, {useContext} from "react";
import {Avatar, Card} from "antd";
import {Link} from "react-router-dom";
import moment from "moment";
import GroupLikeButton from "./GroupLikeButton";
import GroupDeleteButton from "./GroupDeleteButton";
import {AuthContext} from "../../context/auth";
import GroupEditButton from "./GroupEditButton";

const {Meta} = Card;

const GroupInformationCard = ({
                                  group: {id, body, username, createdAt, bio, avatar, likes, likeCount, admins},
                                  deleteGroupCallback
                              }) => {
    const {user} = useContext(AuthContext);

    let groupActions =
        user && user.username === username
            ? [
                <GroupLikeButton user={user} group={{id, username, likes, likeCount, admins}}/>,
                <GroupDeleteButton groupId={id} callback={deleteGroupCallback}/>
            ]
            : [<GroupLikeButton user={user} group={{id, username, likes, likeCount, admins}}/>];

    return (
        <Card
            cover={<img alt="avatar" src={avatar ? avatar : "/logo192.png"}/>}
            actions={groupActions}
            bordered={false}
            style={{marginBottom: "24px"}}
        >
            <Meta
                avatar={
                    <Link to={`/users/${username}`}>
                        <Avatar style={{color: "#f56a00", backgroundColor: "#fde3cf"}}>
                            {username}
                        </Avatar>
                    </Link>
                }
                title={body}
                description={
                    <>
                        <p>
                            {username} 创建于 {moment(createdAt).fromNow()}
                        </p>
                        <p>{bio}</p>
                        {user && likes.find(like => like.username === user.username) && <a href={`https://live.alight.show/?username=${user.username}&credential='${user.saltedPassword}'&courseId=${id}`}>直播间地址</a>}
                        {user && (user.username === username || admins.find(admin => admin.username === user.username)) &&
                        <GroupEditButton groupId={id} group={{
                            id,
                            body,
                            username,
                            createdAt,
                            bio,
                            avatar,
                            likes,
                            likeCount,
                            admins
                        }}/>
                        }
                    </>
                }
            />
        </Card>
    );
};

export default GroupInformationCard;
