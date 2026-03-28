"use client"

import * as React from "react"
import { Tabs } from "@base-ui/react/tabs"

import { cn } from "@/lib/utils"

interface TabsRootProps {
  className?: string
  children: React.ReactNode
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
}

function TabsRoot({ className, children, ...props }: TabsRootProps) {
  return (
    <Tabs.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      {children}
    </Tabs.Root>
  )
}

interface TabsListProps {
  className?: string
  children: React.ReactNode
}

function TabsList({ className, children, ...props }: TabsListProps) {
  return (
    <Tabs.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex h-9 w-fit items-center justify-start rounded-lg bg-muted p-1 text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </Tabs.List>
  )
}

interface TabsTriggerProps {
  className?: string
  children: React.ReactNode
  value: string
  disabled?: boolean
}

function TabsTrigger({ className, children, ...props }: TabsTriggerProps) {
  return (
    <Tabs.Tab
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[selected]:bg-background data-[selected]:text-foreground data-[selected]:shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </Tabs.Tab>
  )
}

interface TabsContentProps {
  className?: string
  children: React.ReactNode
  value: string
}

function TabsContent({ className, children, ...props }: TabsContentProps) {
  return (
    <Tabs.Panel
      data-slot="tabs-content"
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    >
      {children}
    </Tabs.Panel>
  )
}

export { TabsRoot as Tabs, TabsList, TabsTrigger, TabsContent }
