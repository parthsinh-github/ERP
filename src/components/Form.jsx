import React from "react";

const Form = () => {
    return (
        <div style={styles.pageContainer}>
            <h1>Form Page</h1>
            <div style={styles.card}>Form Content Here</div>
        </div>
    );
};

const styles = {
    pageContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#e8f5e9",
    },
    card: {
        width: "400px",
        height: "200px",
        borderRadius: "10px",
        background: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    },
};

export default Form;
