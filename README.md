# flex-work-check-in-out-automation

![github workflow](https://github.com/stevejkang/flex-work-check-in-out-automation/actions/workflows/healthCheck.yml/badge.svg)

A Flex work check in and out automation script, written in typescript.

## Usage (use PM2)
```bash
$ git clone https://github.com/stevejkang/flex-work-check-in-out-automation.git
$ cd flex-work-check-in-out-automation
$ yarn && yarn build
$ cp .env.example .env
$ vim .env
```

## Core API
### `Flex.createNew(username, password)`: Create Flex instance.

### `FlexInstance.userStatus`: Get user check-in status.

### `FlexInstance.checkIn()`: Call check-in api.

### `FlexInstance.checkOut()`: Call check-out api.

### `FlexInstance.getTodayWorkPlan()`: Retrieve today work plan.
