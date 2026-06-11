import { AndroidProject } from "../types";

export const DEFAULT_TEMPLATES: { [key: string]: AndroidProject } = {
  notes_dark_v1: {
    appName: "NotesPro",
    packageName: "com.example.notespro",
    features: ["SQLite Store", "Dark Theme UI", "Title Filtering", "Local Preferences"],
    simulatedBuildOutputs: [
      "Starting Android Gradle Daemon...",
      "Gradle build speed optimized via active daemon.",
      "Parsing application manifest resource links...",
      "Generating packages: com.example.notespro",
      "Compiling resources (aapt2) -> activity_main.xml, strings.xml",
      "Merging DEX inputs -> dexing class outputs...",
      "Signing package with system-level debug keystore...",
      "Aligning package alignment using zipalign (4-byte optimization)...",
      "Successfully built APK: com.example.notespro v1.0.0"
    ],
    files: [
      {
        path: "app/src/main/AndroidManifest.xml",
        content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.notespro">
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:theme="@style/Theme.NotesPro">
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`
      },
      {
        path: "app/src/main/java/com/example/notespro/MainActivity.java",
        content: `package com.example.notespro;

import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.Button;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import java.util.ArrayList;

public class MainActivity extends AppCompatActivity {
    private ArrayList<String> notesList;
    private ArrayAdapter<String> adapter;
    private EditText inputNote;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        notesList = new ArrayList<>();
        adapter = new ArrayAdapter<>(this, android.R.layout.simple_list_item_1, notesList);
        
        inputNote = findViewById(R.id.input_note);
        ListView listView = findViewById(R.id.listView);
        listView.setAdapter(adapter);

        findViewById(R.id.btn_add).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String text = inputNote.getText().toString().trim();
                if (!text.isEmpty()) {
                    notesList.add(text);
                    adapter.notifyDataSetChanged();
                    inputNote.setText("");
                    Toast.makeText(MainActivity.this, "Note saved!", Toast.LENGTH_SHORT).show();
                }
            }
        });
    }
}`
      },
      {
        path: "app/src/main/res/layout/activity_main.xml",
        content: `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="matchParent"
    android:layout_height="matchParent"
    android:orientation="vertical"
    android:padding="16dp"
    android:background="#121212">

    <TextView
        android:layout_width="wrapContent"
        android:layout_height="wrapContent"
        android:text="NotesPro"
        android:textColor="#FFFFFF"
        android:textSize="24sp"
        android:textStyle="bold"
        android:layout_marginBottom="16dp" />

    <LinearLayout
        android:layout_width="matchParent"
        android:layout_height="wrapContent"
        android:orientation="horizontal">

        <EditText
            android:id="@+id/input_note"
            android:layout_width="0dp"
            android:layout_height="wrapContent"
            android:layout_weight="1"
            android:hint="Type Note Content Here..."
            android:textColor="#FFFFFF"
            android:textColorHint="#999999" />

        <Button
            android:id="@+id/btn_add"
            android:layout_width="wrapContent"
            android:layout_height="wrapContent"
            android:text="Add" />
    </LinearLayout>

    <ListView
        android:id="@+id/listView"
        android:layout_width="matchParent"
        android:layout_height="matchParent"
        android:layout_marginTop="12dp" />
</LinearLayout>`
      },
      {
        path: "app/build.gradle",
        content: `plugins {
    id 'com.android.application'
}

android {
    namespace 'com.example.notespro'
    compileSdk 33

    defaultConfig {
        applicationId "com.example.notespro"
        minSdk 21
        targetSdk 33
        versionCode 1
        versionName "1.0.0"
    }

    buildTypes {
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}`
      }
    ],
    simulatedUI: {
      themeColor: "bg-[#0F0F11]",
      textColor: "text-slate-100",
      layoutType: "notepad",
      screens: [
        {
          title: "NotesPro Desktop Workspace",
          elements: [
            { id: "input_note", type: "input", label: "Note Text", placeholder: "Type note details..." },
            { id: "btn_add", type: "button", label: "Add Note Entry", actionType: "add_list" },
            { id: "list_box", type: "list_container", label: "Notes Feed", actionType: "none" }
          ]
        }
      ]
    }
  },
  calc_minimal: {
    appName: "CalcPro",
    packageName: "com.example.calcpro",
    features: ["Decimal Arithmetic", "Interactive Button Matrix", "Double-precision Values", "Error Handlers"],
    simulatedBuildOutputs: [
      "Initializing calculator compiler layout mappings...",
      "Merging math assets and layout widgets...",
      "Compiling class methods into class files via javac...",
      "Translating JVM byte code into Android DEX runtime binaries...",
      "Verifying cryptographic headers for self-signing...",
      "Zipalign operation complete for CalcPro v2.0.0"
    ],
    files: [
      {
        path: "app/src/main/res/layout/activity_main.xml",
        content: `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="matchParent"
    android:layout_height="matchParent"
    android:orientation="vertical"
    android:background="#090a0f"
    android:padding="20dp">
    
    <TextView
        android:id="@+id/display"
        android:layout_width="matchParent"
        android:layout_height="wrapContent"
        android:text="0"
        android:textColor="#FFFFFF"
        android:textSize="48sp"
        android:gravity="right" />
</LinearLayout>`
      }
    ],
    simulatedUI: {
      themeColor: "bg-slate-950",
      textColor: "text-green-400",
      layoutType: "calculator",
      screens: [
        {
          title: "CalcPro Core VM",
          elements: [
            { id: "calc_dis", type: "status_indicator", label: "0" },
            { id: "calc_c", type: "card_button", label: "C", actionType: "clear" },
            { id: "n_b1", type: "button", label: "7", actionType: "append" },
            { id: "n_b2", type: "button", label: "8", actionType: "append" },
            { id: "n_b3", type: "button", label: "9", actionType: "append" },
            { id: "op_mul", type: "button", label: "*", actionType: "append" },
            { id: "n_b4", type: "button", label: "4", actionType: "append" },
            { id: "n_b5", type: "button", label: "5", actionType: "append" },
            { id: "n_b6", type: "button", label: "6", actionType: "append" },
            { id: "op_sub", type: "button", label: "-", actionType: "append" },
            { id: "n_b7", type: "button", label: "1", actionType: "append" },
            { id: "n_b8", type: "button", label: "2", actionType: "append" },
            { id: "n_b9", type: "button", label: "3", actionType: "append" },
            { id: "op_add", type: "button", label: "+", actionType: "append" },
            { id: "n_b0", type: "button", label: "0", actionType: "append" }
          ]
        }
      ]
    }
  },
  flashlight_toggle: {
    appName: "FlashLightPro",
    packageName: "com.example.flashlight",
    features: ["Camera Flash Hardware Link", "Power Broadcast Listeners", "Wakelocks", "Subtle Fluid Background Glows"],
    simulatedBuildOutputs: [
      "Accessing dynamic Android Manifest permissions...",
      "Adding CAMERA permission triggers...",
      "Bundling hardware power layouts...",
      "Merging flashlight controls into activity classes...",
      "Generating APK signature and running build tools..."
    ],
    files: [
      {
        path: "app/src/main/AndroidManifest.xml",
        content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.flashlight">
    <uses-permission android:name="android.permission.CAMERA" />
    <application
        android:allowBackup="true"
        android:label="FlashLightPro">
        <activity android:name=".MainActivity" />
    </application>
</manifest>`
      }
    ],
    simulatedUI: {
      themeColor: "bg-[#18181B]",
      textColor: "text-white",
      layoutType: "flashlight",
      screens: [
        {
          title: "Flashlight API Level 33",
          elements: [
            { id: "state_label", type: "status_indicator", label: "Status: OFF" },
            { id: "toggle_flash", type: "switch", label: "Enable Flash Beam", actionType: "toggle" }
          ]
        }
      ]
    }
  }
};
