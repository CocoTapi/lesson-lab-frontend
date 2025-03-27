import { useState, useEffect } from "react";
import Accordion from "../UI/Accordion";
import classes from '../css/user_page/PlaylistItem.module.css';
import { FaStar } from "react-icons/fa";
import { MdAddCircle } from "react-icons/md";
import { GoTrash } from "react-icons/go";
import IconButton from "../UI/IconButton";
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import PlaylistActivityItem from "./PlaylistActivityItem";
import ButtonS from "../UI/ButtonS";

function PlaylistItem({playlist, onRemoveActivity, onDeletePlaylist, onAddActivity, playlistButtons, activityButtons, saveOrder, showChangeOrderButton }) {
    const [ showStarIcon, setShowStarIcon] = useState(false);
    const [ showSummary, setShowSummary ] = useState(false);
    const [activities, setActivities] = useState(playlist.activities);
    const [isReorderMode, setIsReorderMode] = useState(false);
    const [reorderedActivities, setReorderedActivities] = useState([]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 640) {
                setShowStarIcon(true);
                setShowSummary(true);
            } else {
                setShowStarIcon(false);
                setShowSummary(false);
            }
        };

        handleResize();

        // Listen for resize events
        window.addEventListener('resize', handleResize);

        // Clean up
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    //console.log(playlist)

    const handleDragEnd = (event) => {
        const { active, over } = event;
    
        if (active.id !== over.id) {
          setActivities((items) => {
            const oldIndex = items.findIndex(item => item.activity_id === active.id);
            const newIndex = items.findIndex(item => item.activity_id === over.id);
            const newOrderedItems = arrayMove(items, oldIndex, newIndex)

            //save the new order
            setReorderedActivities(newOrderedItems);

            return newOrderedItems;
          });    
        }
    };

    const handleSaveOrder = () => {
        const orderUpdate = []
        reorderedActivities.map((item) => (
            orderUpdate.push(item.activity_id)
        ));
        saveOrder(playlist.playlist_id, orderUpdate);
        setIsReorderMode(false);
    }

    const handleOrderModeClick = () => {
        if (isReorderMode) {
            handleSaveOrder();
        } else {
            setIsReorderMode(true);
        }
    }

    return (
        <div className={classes.accordionComponent}>
            <Accordion 
                headerTitle={ showStarIcon ?
                    playlist.playlist_title
                : (
                    <div className={classes.playlistTitle}>
                        <p className={classes.star}><FaStar /></p> 
                        <p>{playlist.playlist_title}</p>
                    </div>
                    
                ) 
                }
                headerContents={
                    <div className={classes.totalDuration}>
                        <p className={classes.labelTitle}>Total :</p>
                        {playlist.total_duration ? 
                            <p className={classes.info}>{playlist.total_duration} mins</p>
                            : <p className={classes.info}> 0 mins</p>
                        }
                    </div>
                }
                topImage={ showStarIcon ? (
                    <div className={classes.star}>
                        <p><FaStar /></p>
                    </div>
                ) : ''
                }
                activityDetail={ 
                    <div>
                        { showChangeOrderButton !== 'false' && playlist.activities.length > 1 &&
                            <div className={classes.reorderButtonComponent}>
                            <ButtonS colorScheme="primaryBorder" onClick={handleOrderModeClick} >
                                {isReorderMode ? "Save Order" : "Change Order"}
                            </ButtonS>
                            </div>
                        }
                        { isReorderMode ? 
                            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <SortableContext items={activities.map(item => item.activity_id)} strategy={verticalListSortingStrategy}>
                                    <ul>
                                        {activities[0]?.activity_id && activities.map((item, i) => (
                                            <PlaylistActivityItem
                                                key={item.activity_id}
                                                item={item}
                                                i={i}
                                                showSummary={showSummary}
                                                activityButtons={activityButtons}
                                                onRemoveActivity={onRemoveActivity}
                                                playlist={playlist}
                                                isReorderMode={isReorderMode}
                                            />
                                        ))}
                                    </ul>
                                </SortableContext>
                            </DndContext>
                            : 
                            <ul>
                                {activities[0]?.activity_id && activities.map((item, i) => (
                                    <PlaylistActivityItem
                                        key={item.activity_id}
                                        item={item}
                                        i={i}
                                        showSummary={showSummary}
                                        activityButtons={activityButtons}
                                        onRemoveActivity={onRemoveActivity}
                                        playlist={playlist}
                                        isReorderMode={isReorderMode}
                                    />
                                ))}
                            </ul>
                        }
                    </div>
                    
                }
                buttonChildren={ playlistButtons? (
                    <div className={classes.iconButtonGroup}>
                        <IconButton onClick={() => onAddActivity(playlist.playlist_id, playlist.user_id, playlist.playlist_title, playlist.activity_ids)}>
                            <MdAddCircle className={classes.plusIconButton} />
                        </IconButton>
                        <IconButton onClick={() => onDeletePlaylist(playlist.playlist_id, playlist.playlist_title)}>
                            <GoTrash className={classes.trashIconButton} />
                        </IconButton>   
                    </div>
                ) : ''
                    
                }
            />
        </div>
    )

}

export default PlaylistItem;