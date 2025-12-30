"use client"

import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector, RootState } from "@/lib/store"
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from "@/lib/features/customer/customerSlice"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { Bell, FileText, MessageSquare, Trash2, CheckCheck, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("All")
  const dispatch = useAppDispatch()
  const { notifications, status, error } = useAppSelector((state: RootState) => state.customer)
  const { toast } = useToast()

  useEffect(() => {
    dispatch(getNotifications())
  }, [dispatch])

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "Unread") return !n.read
    return true
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleToggleRead = async (id: string) => {
    try {
      await dispatch(markNotificationAsRead(id)).unwrap()
    } catch (err) {
      toast({ title: "Error", description: "Failed to update notification.", variant: "destructive" })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteNotification(id)).unwrap()
      toast({ description: "Notification deleted." })
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete notification.", variant: "destructive" })
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await dispatch(markAllNotificationsAsRead()).unwrap()
      toast({ description: "All notifications marked as read." })
    } catch (err) {
      toast({ title: "Error", description: "Failed to mark all as read.", variant: "destructive" })
    }
  }

  const NotificationSkeleton = () => (
    <div className="p-4 flex gap-4 items-start">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="grow space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
        <p className="text-muted-foreground">View messages and updates regarding your applications.</p>
      </div>

      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="All">All</TabsTrigger>
                <TabsTrigger value="Unread">
                  Unread {unreadCount > 0 && <span className="ml-2 bg-primary text-primary-foreground h-5 w-5 rounded-full flex items-center justify-center text-xs">{unreadCount}</span>}
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" size="sm" onClick={handleMarkAllRead} disabled={unreadCount === 0 || status === 'loading'}>
              <CheckCheck className="w-4 h-4 mr-2" />
              Mark all as read
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {status === 'loading' && notifications.length === 0 ? (
            <div className="divide-y">{Array.from({ length: 4 }).map((_, i) => <NotificationSkeleton key={i} />)}</div>
          ) : status === 'failed' && notifications.length === 0 ? (
            <div className="text-center py-20"><XCircle className="w-12 h-12 text-destructive mx-auto mb-4" /><h3 className="text-lg font-semibold">Failed to load notifications</h3><p className="text-muted-foreground">{error}</p></div>
          ) : filteredNotifications.length > 0 ? (
            <div className="divide-y">
              {filteredNotifications.map((notification) => (
                <div key={notification._id} className="group relative p-4 flex gap-4 items-start hover:bg-muted/50 cursor-pointer" onClick={() => !notification.read && handleToggleRead(notification._id)}>
                  {!notification.read && (<div className="absolute left-2 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary animate-pulse"></div>)}
                  <div className="pl-4">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", notification.read ? 'bg-muted' : 'bg-primary/10')}>
                      {notification.type === "update" ? (<FileText className={cn("w-5 h-5", notification.read ? 'text-muted-foreground' : 'text-primary')} />) : (<MessageSquare className={cn("w-5 h-5", notification.read ? 'text-muted-foreground' : 'text-primary')} />)}
                    </div>
                  </div>
                  <div className="grow">
                    <p className={cn("text-sm", notification.read ? "text-muted-foreground" : "text-foreground font-semibold")}>{notification.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(notification.timestamp).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); handleToggleRead(notification._id); }}><CheckCheck className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive" onClick={(e) => { e.stopPropagation(); handleDelete(notification._id); }}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4"><Bell className="w-8 h-8 text-muted-foreground" /></div>
              <h3 className="text-lg font-semibold">No notifications yet</h3>
              <p className="text-muted-foreground">We'll let you know when we have something for you.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}