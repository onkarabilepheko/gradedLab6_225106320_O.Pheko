import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

const UJCampusNoticesScreen = () => {

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

 
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

      
      setNotices(data.slice(0, 10));

    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

 
  useEffect(() => {
    getNotices();
  }, []);


  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading notices...</Text>
      </View>
    );
  }

  
  if (error) {
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

  return (
    <View style={styles.container}>

      <Text style={styles.heading}>
        UJ Campus Notices
      </Text>

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
    marginBottom: 15,
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

});

export default UJCampusNoticesScreen;