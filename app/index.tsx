import { StyleSheet, Image, Platform, View, Alert } from 'react-native';

import React from "react";
import { WebView } from "react-native-webview";
import { SafeAreaView, } from 'react-native-safe-area-context';

const MyWebView = () => {
const hideCon = `
  function hideReelsButton() {
    let reelsLinks = document.querySelectorAll("a[href*='/reels/']");

    if (reelsLinks.length > 0) {
      reelsLinks.forEach(link => {
        link.style.display = "none"; // Hide the button
        link.remove(); // Remove from DOM completely
      });
      console.log("Reels button hidden.");
    } else {
      console.log("Reels button not found yet.");
    }
  }

  // Keep checking every 1500ms until the button is found
  let observer = setInterval(hideReelsButton, 1500);

  // Stop checking after 10 seconds to avoid infinite loop
  setTimeout(() => clearInterval(observer), 10000);

  // Also prevent clicking if the button appears later
  document.addEventListener("click", function(event) {
    let target = event.target;
    
    while (target && target.tagName !== "A") {
      target = target.parentElement;
    }

    if (target && target.href.includes("/reels/")) {
      event.preventDefault();  // Block navigation
      target.style.display = "none"; // Hide button after clicking
      target.remove(); // Completely remove the button
      console.log("Blocked Reels button click.");
    }
  });

  true; // Required for Android
`;

const script = `
  function disableVideos() {
    console.log("Disabling all videos...");

    // Hide Reels and Explore buttons
    let reelsButton = document.querySelector("a[href*='/reels/']");
    if (reelsButton) {
      reelsButton.style.display = "none";
      reelsButton.remove();
      console.log("Reels button hidden.");
    }

    let exploreButton = document.querySelector("a[href*='/explore/']");
    if (exploreButton) {
      exploreButton.style.display = "none";
      exploreButton.remove();
      console.log("Explore button hidden.");
    }
  }

  // Run every 2 seconds to catch new videos
  setInterval(disableVideos, 5000);

  // Use MutationObserver to track dynamic content
  const observer = new MutationObserver(disableVideos);
  observer.observe(document.body, { childList: true, subtree: true });

  console.log("Script activated: All videos disabled.");
  true; // Required for Android
`;


  return (
    <SafeAreaView style={styles.container}>
      <WebView 
        source={{ uri: "https://www.instagram.com" }} 
        injectedJavaScript={script}
        javaScriptEnabled={true}
        style={ styles}
        onMessage={(event) => {
            console.log("Clicked Element ID", event.nativeEvent.data);
          }}
          allowsInlineMediaPlayback={true}  // Enables inline video playback
        mediaPlaybackRequiresUserAction={true} // Prevents autoplay
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});

export default MyWebView;
