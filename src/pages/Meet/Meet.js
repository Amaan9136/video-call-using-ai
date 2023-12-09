import { useEffect } from "react";
import { connect } from "react-redux";
import MainScreen from "../../components/MainScreen/MainScreen.component";
import firepadRef, { db } from "../../server/firebase";
import {
  addParticipant,
  removeParticipant,
  setMainStream,
  setUser,
  updateParticipant,
} from "../../store/actioncreator";
import "./Meet.css";

function Meet(props) {
  const { name, setMainStream, setUser, addParticipant, removeParticipant, updateParticipant } = props;

  const getUserStream = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    return localStream;
  };

  useEffect(() => {
    let isSubscribed = true; // Flag to track component unmounting

    const fetchData = async () => {
      try {
        const stream = await getUserStream();
        if (isSubscribed) {
          stream.getVideoTracks()[0].enabled = false;
          setMainStream(stream);

          const connectedRef = db.database().ref(".info/connected");
          const participantRef = firepadRef.child("participants");

          connectedRef.on("value", (snap) => {
            if (snap.val()) {
              const defaultPreference = {
                audio: true,
                video: false,
                screen: false,
              };
              const userStatusRef = participantRef.push({
                userName: name,
                preferences: defaultPreference,
              });
              setUser({
                [userStatusRef.key]: { name, ...defaultPreference },
              });
              userStatusRef.onDisconnect().remove();
            }
          });

          participantRef.on("child_added", (snap) => {
            const preferenceUpdateEvent = participantRef.child(snap.key).child("preferences");
            preferenceUpdateEvent.on("child_changed", (preferenceSnap) => {
              updateParticipant({
                [snap.key]: {
                  [preferenceSnap.key]: preferenceSnap.val(),
                },
              });
            });

            const { userName: name, preferences = {} } = snap.val();
            addParticipant({
              [snap.key]: {
                name,
                ...preferences,
              },
            });
          });

          participantRef.on("child_removed", (snap) => {
            removeParticipant(snap.key);
          });

          window.history.replaceState(null, "Meet", "?id=" + firepadRef.key);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {
      // Cleanup function to unsubscribe when component unmounts
      isSubscribed = false;
    };
  }, [name, setMainStream, setUser, addParticipant, removeParticipant, updateParticipant]);

  return (
    <div className="Meet">
      <MainScreen />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    stream: state.mainStream,
    user: state.currentUser,
  };
};

const mapDispatchToProps = {
  setMainStream,
  addParticipant,
  setUser,
  removeParticipant,
  updateParticipant,
};

export default connect(mapStateToProps, mapDispatchToProps)(Meet);