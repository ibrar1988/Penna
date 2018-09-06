package com.techv.penna.services;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Intent;
import android.graphics.Color;
import android.util.Log;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import org.json.JSONObject;


public class MessagingService extends FirebaseMessagingService {

    private static final String TAG = MessagingService.class.getSimpleName();

    NotificationManager notificationManager;


    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {

        Log.d("onMessage", "From: " + remoteMessage.getFrom());
        Log.d("remoteMessage ", "remoteMessage: " + remoteMessage.getNotification());
        Log.d(TAG, "From: " + remoteMessage.getFrom());
        Log.d(TAG, "Type: " + remoteMessage.getMessageType());

        Log.d(TAG, "Message data payload: " + remoteMessage.getData());
        Log.e(TAG, "Data Payload: " + remoteMessage.getData().toString());

        String rawData = "";
        int badgeCount = 0;

        JSONObject data = new JSONObject();

        broadcastNotification("Penna", data, badgeCount);
    }

    private void broadcastNotification(String title, JSONObject data, int badgeCount) {
        try {

            String message = "Default Message", id = "";

            String notificationType = "";

            PendingIntent pendingIntent;

            Intent intent;

            int notify_id = (int)(System.currentTimeMillis());

            pendingIntent = PendingIntent.getActivity(this, (int)(System.currentTimeMillis()), null, PendingIntent.FLAG_ONE_SHOT);

            //NotificationManager mNotificationManager = (NotificationManager) this.getApplicationContext().getSystemService(Context.NOTIFICATION_SERVICE);

            NotificationChannel notificationChannel;

            Notification.Builder notificationBuilder;

            Notification notificationObject = null;

            try {

                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {

                    String CHANNEL_ID = "";

                    String CHANNEL_NAME = "";

                    int priority = NotificationManager.IMPORTANCE_HIGH;

                    notificationChannel = new NotificationChannel(CHANNEL_ID, CHANNEL_NAME, priority);

                    notificationChannel.setDescription("Penna Notification Description");

                    notificationChannel.enableLights(true);

                    notificationChannel.setLightColor(Color.RED);

                    notificationChannel.setVibrationPattern(new long[]{0, 1000, 500, 1000});

                    notificationChannel.enableVibration(true);

                    notificationChannel.setShowBadge(true);

                    notificationManager.createNotificationChannel(notificationChannel);

                    notificationBuilder = new Notification.Builder(this, CHANNEL_ID);

                } else {

                    notificationBuilder = new Notification.Builder(this);
                }

                notificationBuilder.setContentTitle(title);
                notificationBuilder.setContentText(message);
                notificationBuilder.setAutoCancel(true);
                notificationBuilder.setDefaults(Notification.DEFAULT_SOUND);
                notificationBuilder.setPriority(Notification.PRIORITY_HIGH);
                notificationBuilder.setContentIntent(pendingIntent);
                notificationBuilder.setNumber(badgeCount);
                notificationObject = notificationBuilder.build();

            } catch (Exception ex) {
                ex.printStackTrace();
            }

            notificationManager.notify((int)(System.currentTimeMillis()), notificationObject);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
