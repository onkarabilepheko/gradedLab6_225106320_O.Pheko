import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CACHE_KEY = "@uj/notices/cache";
const LAST_UPDATED_KEY = "@uj/notices/lastUpdated";

const UJCampusNoticesScreen = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [offline, setOffline] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");

  
  const loadSavedNotices = async () => {
    try {
      const savedNotices = await AsyncStorage.getItem(CACHE_KEY);
      const savedTime = await AsyncStorage.getItem(LAST_UPDATED_KEY);

      if (savedNotices) {
        setNotices(JSON.parse(savedNotices));
        setOffline(true);
      }

      if (savedTime) {
        setLastUpdated(savedTime);
      }

      return savedNotices !== null;
    } catch (error) {
      return false;
    }
  };

  
  const getNotices = async () => {
    try {
      setLoading(true);
      setError(false);

      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = await response.json();
      const first10 = data.slice(0, 10);

      
      setNotices(first10);
      setOffline(false);

     
      await AsyncStorage.setItem(
        CACHE_KEY,
        JSON.stringify(first10)
      );

      
      const now = new Date();
      const time = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      await AsyncStorage.setItem(
        LAST_UPDATED_KEY,
        time
      );

      setLastUpdated(time);

    } catch (error) {
      
      const hasSavedNotices = await loadSavedNotices();

      if (!hasSavedNotices) {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    const startApp = async () => {
      await loadSavedNotices();
      await getNotices();
    };

    startApp();
  }, []);

  
  const clearSavedNotices = async () => {
    try {
      await AsyncStorage.removeItem(CACHE_KEY);
      await AsyncStorage.removeItem(LAST_UPDATED_KEY);

      setNotices([]);
      setLastUpdated("");
      setOffline(false);
      setError(true);

      alert("Saved notices cleared");
    } catch (error) {
      alert("Could not clear saved notices");
    }
  };

  
  const NoticeCard = ({ item }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>
          {item.title}
        </Text>

        <Text style={styles.description}>
          {item.body}
        </Text>
      </View>
    );
  };

  
  if (loading && notices.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading notices...</Text>
      </View>
    );
  }

  
  if (error && notices.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>
          Unable to load notices. Check your connection and try again.
        </Text>

        <Button
          title="Retry"
          onPress={getNotices}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <Text style={styles.heading}>
        UJ Campus Notices
      </Text>

      {offline && (
        <Text style={styles.savedStatus}>
          Saved copy • Last updated {lastUpdated}
        </Text>
      )}

      <FlatList
        data={notices}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <NoticeCard item={item} />
        )}
      />

      <Button
        title="Refresh"
        onPress={getNotices}
      />

      <View style={styles.buttonSpace} />

      <Button
        title="Clear Saved Notices"
        onPress={clearSavedNotices}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },

  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },

  savedStatus: {
    marginBottom: 15,
    fontSize: 14,
  },

  card: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#eeeeee",
    borderRadius: 8,
  },

  title: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 5,
  },

  description: {
    fontSize: 14,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  error: {
    textAlign: "center",
    marginBottom: 15,
  },

  buttonSpace: {
    height: 10,
  },
});

export default UJCampusNoticesScreen;