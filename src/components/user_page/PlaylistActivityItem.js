import Accordion from "../UI/Accordion";
import classes from '../css/user_page/PlaylistItem.module.css';
import { GoTrash } from "react-icons/go";
import IconButton from "../UI/IconButton";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GrDrag } from "react-icons/gr";
import { baseName } from "../../App";

function PlaylistActivityItem({ item, i, showSummary, activityButtons, onRemoveActivity, playlist, isReorderMode }){
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.activity_id });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };
  
    return (
      <li ref={setNodeRef} style={style} {...attributes} {...listeners} key={i}>
        <div className={classes.activityItemComponent}>
            {isReorderMode && <GrDrag />}
            <h1 className={classes.listNum}>
                {i + 1}.
            </h1>
          <Accordion
            headerTitle={<div className={classes.activityTitle}>{item.title}</div>}
            headerContents={
              <div>
                {showSummary && (
                  <div className={classes.detailItem}>
                    <p>{item.summary}</p>
                  </div>
                )}
                <div className={classes.durationGroup}>
                  <p className={classes.labelTitle}>Duration :</p>
                  <p className={classes.info}>{item.duration === 31 ? '30 ~ ' : item.duration} mins</p>
                </div>
              </div>
            }
            topImage={
              <div className={classes.accordionImage}>
                <img src={`${baseName}/images/large/${item.image_num}.png`} alt="example" style={{ borderRadius: '10px' }} />
              </div>
            }
            activityDetail={
              <div className={classes.accordionDetail}>
                <div className={classes.leftDetailItems}>
                  <div className={classes.detailItem}>
                    <p className={classes.labelTitle}>Materials :</p>
                    <p>{item.materials}</p>
                  </div>
                </div>
                <div className={classes.rightDetailItems}>
                  {!showSummary && (
                    <div className={classes.detailItem}>
                      <p className={classes.labelTitle}>Summary :</p>
                      <p>{item.summary}</p>
                    </div>
                  )}
                  <div className={classes.detailItem}>
                    <p className={classes.labelTitle}>Objectives :</p>
                    <p>{item.objectives}</p>
                  </div>
                  <div className={classes.detailItem}>
                    <p className={classes.labelTitle}>Instructions :</p>
                    <p>{item.instructions}</p>
                  </div>
                  <div className={classes.detailItem}>
                    <p className={classes.labelTitle}>References :</p>
                    <p className={classes.accordionReference}>
                      none
                    </p>
                  </div>
                </div>
              </div>
            }
            buttonChildren={activityButtons ? (
              <IconButton onClick={() => onRemoveActivity(item.activity_id, item.title, playlist.playlist_id, playlist.playlist_title, item.duration)}>
                <GoTrash className={classes.playlistItemTrash} />
              </IconButton>
            ) : ''}
            expandable={isReorderMode ? false : true}
          />
        </div>
      </li>
    );
  };

export default PlaylistActivityItem;